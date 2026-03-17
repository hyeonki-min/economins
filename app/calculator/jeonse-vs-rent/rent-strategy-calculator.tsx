"use client"

import { useEffect, useMemo, useState } from "react"
import JeonseToRentResult from "@/app/calculator/jeonse-vs-rent/jeonse-to-rent-result"
import RentToJeonseResult from "@/app/calculator/jeonse-vs-rent/rent-to-jeonse-result"
import { Card, InputRow, MoneyInput, NumberInput, PercentInput } from "@/app/ui/calculator/component"

type Mode = "jeonseToRent" | "rentToJeonse"

export function calculateAllowedRentIncrease({
  deposit,
  monthlyRent,
  newDeposit,
  conversionRate = 0.05,
  increaseLimit = 0.05,
}: {
  deposit: number
  monthlyRent: number
  newDeposit: number
  conversionRate?: number
  increaseLimit?: number
}) {

  // 현재 환산 보증금
  const convertedDeposit =
    deposit + (monthlyRent * 12) / conversionRate

  // 5% 인상 상한
  const maxConverted =
    convertedDeposit * (1 + increaseLimit)

  // 새 보증금 기준 허용 월세
  const allowedMonthlyRent =
    ((maxConverted - newDeposit) * conversionRate) / 12

  return {
    convertedDeposit,
    maxConverted,
    allowedMonthlyRent: Math.max(0, allowedMonthlyRent),
  }
}

export function calculateFutureMonthlyRent({
  currentMonthlyRent,
  years,
  marketGrowthRate,
}: {
  currentMonthlyRent: number
  years: number
  marketGrowthRate: number
}) {
  let rent = currentMonthlyRent

  // 2~4년 : 계약갱신청구권 (5% 제한)
  if (years >= 4) {
    rent = rent * 1.05
  }

  // 4년 이후 : 시장 상승률
  const remainingYears = Math.max(0, years - 4)

  const periods = Math.floor(remainingYears / 2)

  rent = rent * Math.pow(1 + marketGrowthRate, periods)

  return Math.round(rent)
}

export default function RentStrategyCalculator() {
  const [mode, setMode] = useState<Mode>("jeonseToRent")

  const [jeonse, setJeonse] = useState(300000000)
  const [deposit, setDeposit] = useState(100000000)
  const [monthlyRent, setMonthlyRent] = useState(800000)

  const [conversionRate, setConversionRate] = useState(0.05)

  const [years, setYears] = useState(2)
  const [jeonseGrowth, setJeonseGrowth] = useState(0.03)
  const [rentGrowth, setRentGrowth] = useState(0.03)

  const [monthlySaving, setMonthlySaving] = useState(1000000)
  const [investmentReturn, setInvestmentReturn] = useState(0.05)

  const [loanEnabled, setLoanEnabled] = useState(false)
  const [loanAmount, setLoanAmount] = useState(100000000)
  const [loanRate, setLoanRate] = useState(0.04)

  
  const convertedJeonse = useMemo(() => {
    if (mode !== "rentToJeonse") return 0

    return deposit + (monthlyRent * 12) / conversionRate
  }, [mode, deposit, monthlyRent, conversionRate])

  const requiredLoan = useMemo(() => {
    if (mode !== "rentToJeonse") return 0

    return Math.max(0, convertedJeonse - deposit)
  }, [mode, convertedJeonse, deposit])
  
  useEffect(() => {
    if (mode === "jeonseToRent") {
      setLoanEnabled(false)
      setLoanAmount(0)
      return
    }

    if (requiredLoan > 0) {
      setLoanEnabled(true)
      setLoanAmount(requiredLoan)
    } else {
      setLoanEnabled(false)
      setLoanAmount(0)
    }

  }, [mode, requiredLoan])


  const futureMonthlyRent = useMemo(() => {
    let rent = monthlyRent

    if (years >= 4) {
      rent *= 1.05
    }

    const remainingYears = Math.max(0, years - 4)
    const periods = Math.floor(remainingYears / 2)

    rent *= Math.pow(1 + rentGrowth, periods)

    return Math.round(rent)
  }, [monthlyRent, years, rentGrowth])


  const result = useMemo(() => {
    let convertedMonthlyRent = 0

    if (mode === "jeonseToRent") {
      convertedMonthlyRent =
        ((jeonse - deposit) * conversionRate) / 12
    }

    const yearlyMonthlyRent = monthlyRent * 12

    const loanInterest = loanEnabled
    ? (loanAmount * loanRate) / 12
    : 0

    const rentSaving = mode === "rentToJeonse"
        ? Math.max(0, monthlyRent - loanInterest)
        : 0
    const effectiveSaving = mode === "rentToJeonse"
        ? Math.max(0, monthlySaving + rentSaving)
        : Math.max(0, monthlySaving - loanInterest)

    const yearlyCost = mode === "jeonseToRent"
        ? yearlyMonthlyRent + loanInterest * 12
        : loanInterest * 12

    const investable =
      mode === "jeonseToRent" ? loanEnabled ? jeonse - deposit + loanAmount : jeonse - deposit : 0

    const totalSavings =
      monthlySaving * 12 * years

    const futureJeonse =
      jeonse * Math.pow(1 + jeonseGrowth, years / 2)

    const shortage =
      futureJeonse - (jeonse + totalSavings)
    const monthlyRate = investmentReturn / 12
    const months = years * 12

    // 월 투자금
    const monthlyInvestable = effectiveSaving

    // 미래 가치
    const investmentFutureValue =
    monthlyRate === 0
        ? monthlyInvestable * months
        : monthlyInvestable *
        ((Math.pow(1 + monthlyRate, months) - 1) /
            monthlyRate)

    // 총 원금
    const totalContribution =
    monthlyInvestable * months

    // 저축 투자 수익 (거주기간)
    const savingInvestmentProfit =
    investmentFutureValue - totalContribution

    // 보증금 투자 연 수익
    const yearlyDepositReturn =
    investable * investmentReturn

    const totalHousingCost = yearlyCost * years

  // 보증금 투자 수익
  const depositInvestmentProfit =
    investable *
    (Math.pow(1 + investmentReturn, years) - 1)

  // 월 투자 미래가치
  const savingInvestmentFutureValue =
    investmentFutureValue

  // 전세 → 월세 자산 증가
  const totalInvestmentValue = depositInvestmentProfit + savingInvestmentFutureValue
  const jeonseToRentAssetIncrease =
    depositInvestmentProfit +
    savingInvestmentFutureValue -
    totalHousingCost

  // 월세 절약 투자
  const rentSavingMonthly =
    Math.max(0, monthlyRent - loanInterest)

  // 월세 → 전세 투자금
  const rentInvestable =
    monthlySaving + rentSavingMonthly

  const rentInvestmentFutureValue =
    monthlyRate === 0
      ? rentInvestable * months
      : rentInvestable *
        ((Math.pow(1 + monthlyRate, months) - 1) /
          monthlyRate)

  // 월세 → 전세 자산 증가
  const rentToJeonseAssetIncrease = rentInvestmentFutureValue - totalHousingCost
    return {
    convertedMonthlyRent,
    convertedJeonse,
    requiredLoan,
    loanInterest,
    monthlyInvestable,
    investable,
    yearlyCost,
    yearlyMonthlyRent,
    futureJeonse,
    shortage,
    yearlyDepositReturn,
    depositInvestmentProfit,
    savingInvestmentProfit,
    totalContribution,
    totalHousingCost,
    investmentFutureValue,
    rentInvestmentFutureValue,
    totalInvestmentValue,
    jeonseToRentAssetIncrease,
    rentToJeonseAssetIncrease
    }  }, [
    mode,
    jeonse,
    deposit,
    monthlyRent,
    conversionRate,
    years,
    jeonseGrowth,
    monthlySaving,
    investmentReturn,
    loanEnabled,
    loanAmount,
    loanRate,
  ])

  return (
    <div className="space-y-4">

      {/* mode */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("jeonseToRent")}
          className={`px-4 py-2 rounded-lg border ${
            mode === "jeonseToRent"
              ? "bg-black text-white"
              : ""
          }`}
        >
          전세 → 월세
        </button>

        <button
          onClick={() => setMode("rentToJeonse")}
          className={`px-4 py-2 rounded-lg border ${
            mode === "rentToJeonse"
              ? "bg-black text-white"
              : ""
          }`}
        >
          월세 → 전세
        </button>
      </div>

      {/* input */}
      <div className="grid md:grid-cols-2 gap-6">

        <Card title="기본 입력">

          {mode === "jeonseToRent" && (
            <>
            <InputRow label="전세 보증금">
              <MoneyInput
                value={jeonse}
                onChange={setJeonse}
              />
            </InputRow>
            <InputRow label="월세 보증금">
              <MoneyInput
                value={deposit}
                onChange={setDeposit}
              />
            </InputRow>
            </>
          )}

          {mode === "rentToJeonse" && (
            <>
              <InputRow label="보증금">
                <MoneyInput
                  value={deposit}
                  onChange={setDeposit}
                />
              </InputRow>
              <InputRow label="월세">
                <MoneyInput
                  value={monthlyRent}
                  onChange={setMonthlyRent}
                />              
              </InputRow>

            </>
          )}
              <InputRow label="전환율">
                <PercentInput
                  value={conversionRate}
                  onChange={setConversionRate}
                />
              </InputRow>

        </Card>

        <Card title="투자 조건">
          <InputRow label="월 저축 가능 금액">
            <MoneyInput
              value={monthlySaving}
              onChange={setMonthlySaving}
            />
          </InputRow>
          <InputRow label="투자 수익률">
            <PercentInput
              value={investmentReturn}
              onChange={setInvestmentReturn}
            />
          </InputRow>

        </Card>

        <Card title="거주 시뮬레이션">
          <InputRow label="거주 기간 (년)">
            <NumberInput
              value={years}
              onChange={setYears}
            />
          </InputRow>
          
          <InputRow label="전세 상승률">
            <PercentInput
              value={jeonseGrowth}
              onChange={setJeonseGrowth}
            />
          </InputRow>

          <InputRow label="월세 상승률">
            <PercentInput
              value={rentGrowth}
              onChange={setRentGrowth}
            />
          </InputRow>
         

        </Card>

        <Card title="전세 대출">

          <label className="flex gap-2 items-center mb-3">
            <input
              type="checkbox"
              checked={loanEnabled}
              onChange={(e) =>
                setLoanEnabled(e.target.checked)
              }
            />
            대출 사용
          </label>

          {loanEnabled && (
            <>
              <InputRow label="대출 금액">
              <MoneyInput
                  value={loanAmount}
                  onChange={setLoanAmount}
                />
              </InputRow>
              <InputRow label="대출 금리">
                <PercentInput
                  value={loanRate}
                  onChange={setLoanRate}
                />
              </InputRow>
            </>
          )}

        {mode === "rentToJeonse" && result.requiredLoan > 0 && (
            <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-lg text-sm text-yellow-700">
                전세 전환 시 부족한 보증금
                <b> {result.requiredLoan.toLocaleString()}원</b> 만큼
                전세 대출이 필요합니다.
            </div>
        )}

        </Card>

      </div>

      <div className="border rounded-xl p-6 bg-gray-50">
      {mode === "jeonseToRent" && (
        <>
        <div className="text-sm text-gray-500">
            전세 → 월세 전환 분석
        </div>

        <div
            className={`text-2xl font-bold mt-2 ${
            result.jeonseToRentAssetIncrease - result.yearlyCost > 0
                ? "text-green-600"
                : "text-red-500"
            }`}
        >
            {Math.round(
            result.jeonseToRentAssetIncrease
            ).toLocaleString()}원
        </div>
        </>
      )}
      {mode === "rentToJeonse" && (
        <>
        <div className="text-sm text-gray-500">
            월세 → 전세 전환 분석
        </div>

        <div
            className={`text-2xl font-bold mt-2 ${
            result.rentToJeonseAssetIncrease - result.yearlyCost > 0
                ? "text-green-600"
                : "text-red-500"
            }`}
        >
            {Math.round(
            result.rentToJeonseAssetIncrease
            ).toLocaleString()}원
        </div>
        </>
      )}
    </div>
    {/* result */}
        <>
      {mode === "jeonseToRent" && (
        <JeonseToRentResult
          deposit={deposit}
          monthlyRent={monthlyRent}
          futureMonthlyRent={futureMonthlyRent}
          result={result}
        />
      )}

      {mode === "rentToJeonse" && (
        <RentToJeonseResult
          deposit={deposit}
          monthlyRent={monthlyRent}
          result={result}
        />
      )}
    </>

    </div>
  )
}
