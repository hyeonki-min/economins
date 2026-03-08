"use client"

import { useMemo, useState } from "react"
import {Card, IntInput, MiniStat, NumberInput, Row, SummaryCards, TogglePill} from "@/app/ui/calculator/component"
import {
  summarizeLoan,
  simulateAnnuityWithRatePath,
  type RepaymentType,
} from "@/app/lib/calculator/calc"
import { calculateLoanCapacity } from "@/app/lib/calculator/loan-capacity"
import {
  buildHybrid5yRatePath,
  buildScenarioRatePath,
  type ScenarioKey,
} from "@/app/lib/calculator/mortgage-scenario"
import { calculateBondCost, type RegionType } from "@/app/lib/calculator/bond"
import {
  calcStampTaxKRW,
  calculateAcquisitionTax,
  calculateBrokerageFee,
} from "@/app/lib/calculator/tax"
import { krw } from "@/app/lib/utils"

const pct = (n: number) => `${n.toFixed(2)}%`

export default function MortgageClient() {
  const [homePriceEok, setHomePriceEok] = useState(8.5)
  const [equityEok, setEquityEok] = useState(2.5)
  const [annualIncome, setAnnualIncome] = useState(8000) // 만원

  const [annualRate, setAnnualRate] = useState(4.2)
  const [years, setYears] = useState(30)
  const [repayment, setRepayment] = useState<RepaymentType>("ANNUITY")

  const [region, setRegion] = useState<RegionType>("capital")
  const [firstHome, setFirstHome] = useState(true)
  const [dsr, setDsr] = useState(0.4)

  const [registryFee, setRegistryFee] = useState(15_000)
  const [scrivenerFee, setScrivenerFee] = useState(300_000)
  const [otherFees, setOtherFees] = useState(0)

  const [scenario, setScenario] = useState<ScenarioKey>("RISING")
  const [hybridFixedRate, setHybridFixedRate] = useState(4.0)
  const [variableStartRate, setVariableStartRate] = useState(3.7)
  const [brokerageEnabled, setBrokerageEnabled] = useState(true)
  
  const preferentialDelta = 0.1

  const homePrice = homePriceEok * 100_000_000
  const equity = equityEok * 100_000_000
  const principal = Math.max(0, Math.round(homePrice - equity))

  const stressRate = region === "capital" ? 1.5 : 1.2
  const ltvRatio = firstHome ? 0.8 : 0.7
  const ltvLoan = Math.round(homePrice * ltvRatio)

  const monthlyIncome = (annualIncome * 10_000) / 12
  const monthlyLimit = monthlyIncome * dsr

  const dsrLoan = useMemo(() => {
    const reviewRate = annualRate + stressRate
    return calculateLoanCapacity({
      monthlyLimit,
      annualRate: reviewRate,
      years,
      repayment,
    })
  }, [monthlyLimit, annualRate, stressRate, years, repayment])

  const maxLoan = Math.min(ltvLoan, dsrLoan)

  const bond = useMemo(() => {
    return calculateBondCost(principal, region)
  }, [principal, region])

  const stampTax = useMemo(() => calcStampTaxKRW(principal) / 2, [principal])

  const acquisitionTax = useMemo(() => {
    return calculateAcquisitionTax(homePrice)
  }, [homePrice])

  const brokerageFee = useMemo(() => {

    if (!brokerageEnabled) return 0

    return calculateBrokerageFee(homePrice)

  }, [homePrice, brokerageEnabled])
  
  const loanAdditionalFees = useMemo(() => {
    return bond.totalCost + stampTax + registryFee + scrivenerFee + otherFees
  }, [bond.totalCost, stampTax, registryFee, scrivenerFee, otherFees])

  const purchaseExtraCost = useMemo(() => {
    return acquisitionTax.total + brokerageFee + loanAdditionalFees
  }, [acquisitionTax.total, brokerageFee, loanAdditionalFees])

  const totalCashNeededAtPurchase = useMemo(() => {
    return equity + purchaseExtraCost
  }, [equity, purchaseExtraCost])

  const base = useMemo(() => {
    return summarizeLoan(
      { principal, annualRate, years, repayment },
      { amount: loanAdditionalFees }
    )
  }, [principal, annualRate, years, repayment, loanAdditionalFees])

  const preferred = useMemo(() => {
    return summarizeLoan(
      {
        principal,
        annualRate: Math.max(0, annualRate - preferentialDelta),
        years,
        repayment,
      },
      { amount: loanAdditionalFees }
    )
  }, [principal, annualRate, years, repayment, loanAdditionalFees])

  const preferentialEffect = useMemo(() => {
    return {
      monthlyDiff: base.monthlyPayment - preferred.monthlyPayment,
      interestDiff: base.totalInterest - preferred.totalInterest,
      costDiff: base.totalCostWithFees - preferred.totalCostWithFees,
    }
  }, [base, preferred])

  const scenarioCompare = useMemo(() => {
    const months = Math.max(1, Math.floor(years * 12))

    const hybridPath = buildHybrid5yRatePath({
      months,
      fixedRate: hybridFixedRate,
      variableStartRate,
      scenario,
    })

    const variablePath = buildScenarioRatePath({
      months,
      startRate: variableStartRate,
      scenario,
    })

    const hybrid = simulateAnnuityWithRatePath({
      principal,
      years,
      repayment: "ANNUITY",
      ratePath: hybridPath,
    })

    const variable = simulateAnnuityWithRatePath({
      principal,
      years,
      repayment: "ANNUITY",
      ratePath: variablePath,
    })

    return {
      hybrid,
      variable,
      diffInterest: variable.totalInterest - hybrid.totalInterest,
    }
  }, [principal, years, hybridFixedRate, variableStartRate, scenario])

  const shortage = Math.max(0, principal - maxLoan)
  const houseEquity = homePrice - principal

  const totalCashRequired =
    houseEquity + purchaseExtraCost
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-6 h-fit">
        <Card title="집 구매 구조">

          <Row label="집 가격">
            <b>{krw(homePrice)}</b>
          </Row>

          <Row label="대출">
            <span>{krw(principal)}</span>
          </Row>

          <Row label="집값 자기자금">
            <span>{krw(houseEquity)}</span>
          </Row>

          <Row label="주택 거래비용">
            <span>{krw(purchaseExtraCost)}</span>
          </Row>

          <Row label="총 필요 현금">
            <b className="text-lg">{krw(totalCashRequired)}</b>
          </Row>
        </Card>
        {principal > maxLoan && (
          <Card title="⚠ 대출 한도 초과">
            <div className="text-sm text-gray-800">
              현재 조건에서는 필요한 대출 <b>{krw(principal)}</b>을 받을 수 없습니다.
            </div>

            <div className="mt-2 text-sm">
              대출 가능 최대 금액은 <b>{krw(maxLoan)}</b> 입니다.
            </div>

            <div className="mt-2 text-sm">
              최소 <b className="text-red-600">{krw(principal - maxLoan)}</b> 이상의
              자기자금이 추가로 필요합니다.
            </div>

            <div className="mt-3 text-xs text-gray-500">
              집 가격을 낮추거나 자기자본을 늘리거나, 소득·대출기간 조건을 조정해보세요.
            </div>
          </Card>
        )}
        <SummaryCards
          title="대출 요약"
          rows={[
            ["필요 대출액", krw(principal)],

            ["월 상환액", krw(base.monthlyPayment)],
            ["총 이자", krw(base.totalInterest)],
            ["총 상환액", krw(base.totalPayment)],

            ["LTV 기준 최대 대출", krw(ltvLoan)],
            ["DSR 기준 최대 대출", krw(dsrLoan)],
            ["최종 가능 대출", krw(maxLoan)],

            [
              "10년 후 남은 원금",
              base.remainingPrincipalAtYear10 == null
                ? "—"
                : krw(base.remainingPrincipalAtYear10),
            ],
          ]}
        />        
        <p className="text-xs text-gray-500 leading-relaxed">
          ※ 계산 결과는 참고용입니다. 정부 정책 및 금융 규제(LTV·DSR),
          은행별 심사 기준, 개인 신용도 등에 따라 실제 대출 가능 금액과 금리는
          달라질 수 있습니다.
        </p>

        <SummaryCards
          title="주택 구매 세금·거래 비용"
          rows={[
            ["취득세·지방교육세·농특세", krw(acquisitionTax.total)],
            ["중개수수료", krw(brokerageFee)],
            ["채권 비용", krw(bond.totalCost)],
            ["대출 실행 비용", krw(loanAdditionalFees)],
            ["총 거래 비용", krw(purchaseExtraCost)],
          ]}
        />

        <Card title="💡 우대금리 0.1%p 효과 (기본 vs 우대)">
          <div className="text-sm text-gray-700">
            {pct(annualRate)} → {pct(Math.max(0, annualRate - preferentialDelta))}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniStat
              label="월 상환액 차이(대표)"
              value={krw(preferentialEffect.monthlyDiff)}
              sub="(기본 - 우대)"
            />
            <MiniStat
              label="총 이자 차이"
              value={krw(preferentialEffect.interestDiff)}
              sub="(기본 - 우대)"
            />
          </div>

          <div className="mt-3 text-xs text-gray-600">
            같은 원금이라도 <b>0.1%p</b> 차이는 총 이자에서 크게 누적됩니다.
          </div>
        </Card>

        <Card title="📊 혼합(5년) vs 변동 비교 결과">
          <div className="text-sm text-gray-700">
            시나리오:{" "}
            <b>
              {scenario === "RISING"
                ? "상승기"
                : scenario === "FALLING"
                ? "하락기"
                : "박스권"}
            </b>
          </div>

          <div className="mt-4 rounded-2xl border border-gray-100 p-4 space-y-2">
            <div className="text-xs text-gray-500">총 이자</div>
            <div className="text-sm tabular-nums">
              혼합: <b>{krw(scenarioCompare.hybrid.totalInterest)}</b>
              <br />
              변동: <b>{krw(scenarioCompare.variable.totalInterest)}</b>
            </div>

            <div className="pt-2 text-sm">
              {renderCompareSentence(scenarioCompare.diffInterest)}
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-600">
            비교는 이해를 위해 <b>원리금균등 + 금리변동 시 매월 리픽싱</b>으로
            단순화했습니다.
          </div>
        </Card>
      </aside>

      <section className="lg:col-span-7 space-y-6">
        <Card title="🏠 집 가격 / 💰 자기자본">
          <Row label="집 가격(억)">
            <NumberInput
              value={homePriceEok}
              step={0.1}
              onChange={setHomePriceEok}
            />
          </Row>

          <Row label="자기자본 합계(억)">
            <NumberInput
              value={equityEok}
              step={0.1}
              onChange={setEquityEok}
            />
          </Row>

          <Row label="현재 연봉(만원)">
            <NumberInput
              value={annualIncome}
              step={100}
              onChange={setAnnualIncome}
            />
          </Row>
        </Card>

        <Card title="📑 대출 조건">
          <Row label="금리(%)">
            <NumberInput
              value={annualRate}
              step={0.01}
              onChange={setAnnualRate}
            />
          </Row>

          <Row label="기간(년)">
            <NumberInput value={years} step={1} onChange={setYears} />
          </Row>

          <div className="space-y-2">
            <div className="text-sm font-medium">상환 방식</div>
            <div className="flex flex-wrap gap-2">
              <TogglePill
                active={repayment === "ANNUITY"}
                onClick={() => setRepayment("ANNUITY")}
              >
                원리금균등
              </TogglePill>
              <TogglePill
                active={repayment === "EQUAL_PRINCIPAL"}
                onClick={() => setRepayment("EQUAL_PRINCIPAL")}
              >
                원금균등
              </TogglePill>
              <TogglePill
                active={repayment === "BULLET"}
                onClick={() => setRepayment("BULLET")}
              >
                만기일시
              </TogglePill>
            </div>
          </div>
        </Card>

        <Card title="📊 대출 규제 조건">
          <Row label="지역">
            <div className="flex gap-2">
              <TogglePill
                active={region === "capital"}
                onClick={() => setRegion("capital")}
              >
                수도권
              </TogglePill>
              <TogglePill
                active={region === "local"}
                onClick={() => setRegion("local")}
              >
                지방
              </TogglePill>
            </div>
          </Row>

          <Row label="생애최초">
            <input
              type="checkbox"
              checked={firstHome}
              onChange={(e) => setFirstHome(e.target.checked)}
            />
          </Row>

          <Row label="DSR 한도(%)">
            <NumberInput
              value={dsr * 100}
              step={1}
              onChange={(v) => setDsr(v / 100)}
            />
          </Row>

          <Row label="스트레스 금리">
            <span className="text-sm font-medium">+{stressRate}%</span>
          </Row>

          <Row label="적용 LTV">
            <span className="text-sm font-medium">{ltvRatio * 100}%</span>
          </Row>
        </Card>

        <Card title="📌 대출 실행 비용">
          <Row label="채권최고액">
            <span className="text-sm font-medium">{krw(bond.bondMax)}</span>
          </Row>

          <Row label="채권 매입률">
            <span className="text-sm font-medium">
              {(bond.bondRate * 100).toFixed(1)}%
            </span>
          </Row>

          <Row label="채권 매입금액">
            <span className="text-sm font-medium">{krw(bond.bondPurchase)}</span>
          </Row>

          <Row label="채권 할인 비용">
            <span className="text-sm font-medium">{krw(bond.discountCost)}</span>
          </Row>

          <Row label="채권 매매 수수료">
            <span className="text-sm font-medium">{krw(bond.tradingFee)}</span>
          </Row>

          <Row label="인지세 (고객 부담)">
            <span className="text-sm font-medium">{krw(stampTax)}</span>
          </Row>

          <Row label="등기신청 수수료">
            <IntInput value={registryFee} onChange={setRegistryFee} />
          </Row>

          <Row label="법무사 보수">
            <IntInput value={scrivenerFee} onChange={setScrivenerFee} />
          </Row>

          <Row label="기타">
            <IntInput value={otherFees} onChange={setOtherFees} />
          </Row>

          <Row label="총 대출 실행 비용">
            <b>{krw(loanAdditionalFees)}</b>
          </Row>

          <p className="text-xs text-gray-600">
            ※ 등록면허세·지방교육세는 은행 부담으로 보았습니다.
            <br />
            ※ 채권 할인율/매매 수수료는 실제 실행 시점과 다를 수 있습니다.
          </p>
        </Card>

        <Card title="🏛 세금 / 거래비용">
          <Row label="취득세율">
            <span className="text-sm font-medium">
              {(acquisitionTax.taxRate * 100).toFixed(2)}%
            </span>
          </Row>

          <Row label="취득세">
            <span className="text-sm font-medium">
              {krw(acquisitionTax.acquisitionTax)}
            </span>
          </Row>

          <Row label="지방교육세">
            <span className="text-sm font-medium">
              {krw(acquisitionTax.educationTax)}
            </span>
          </Row>

          <Row label="농어촌특별세">
            <span className="text-sm font-medium">
              {krw(acquisitionTax.ruralTax)}
            </span>
          </Row>

          <Row label="중개수수료 적용">
            <div className="flex gap-2">
              <TogglePill
                active={brokerageEnabled}
                onClick={() => setBrokerageEnabled(true)}
              >
                매매
              </TogglePill>

              <TogglePill
                active={!brokerageEnabled}
                onClick={() => setBrokerageEnabled(false)}
              >
                청약/직거래
              </TogglePill>
            </div>
          </Row>
          
          <Row label="중개수수료(상한 기준)">
            <span className="text-sm font-medium">
              {krw(brokerageFee)}
            </span>
          </Row>

          <Row label="총 취득/매매 비용">
            <b>{krw(acquisitionTax.total + brokerageFee)}</b>
          </Row>
        </Card>

        <Card title="➕ 혼합 vs 변동 비교 설정">
          <Row label="시나리오">
            <div className="flex flex-wrap gap-1 md:gap-2">
              <TogglePill
                active={scenario === "RISING"}
                onClick={() => setScenario("RISING")}
              >
                상승기
              </TogglePill>
              <TogglePill
                active={scenario === "FALLING"}
                onClick={() => setScenario("FALLING")}
              >
                하락기
              </TogglePill>
              <TogglePill
                active={scenario === "RANGE"}
                onClick={() => setScenario("RANGE")}
              >
                박스권
              </TogglePill>
            </div>
          </Row>

          <Row label="혼합(5년 고정) 금리(%)">
            <NumberInput
              value={hybridFixedRate}
              step={0.01}
              onChange={setHybridFixedRate}
            />
          </Row>

          <Row label="변동 시작금리(%)">
            <NumberInput
              value={variableStartRate}
              step={0.01}
              onChange={setVariableStartRate}
            />
          </Row>

          <p className="text-xs text-gray-600">
            오른쪽 설정을 바꾸면 왼쪽 비교 결과가 바로 갱신됩니다.
          </p>
        </Card>
      </section>
    </div>
  )
}

function renderCompareSentence(diffInterest: number) {
  const abs = Math.abs(diffInterest)

  if (abs < 1) {
    return <span>총 이자는 거의 차이가 없습니다.</span>
  }

  if (diffInterest > 0) {
    return (
      <span>
        총 이자 기준으로 <b>혼합식</b>이 <b>{krw(abs)}</b> 정도 유리합니다.
      </span>
    )
  }

  return (
    <span>
      총 이자 기준으로 <b>변동금리</b>가 <b>{krw(abs)}</b> 정도 유리합니다.
    </span>
  )
}
