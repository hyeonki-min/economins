import { InsuranceFormClient } from "./insurance-form-client"

export const metadata = {
  title: "보험 현금 가치 계산기 | 투자 비교로 현금가치 분석",
  description:
    "보험을 유지할지 해지하고 투자할지 고민되나요? 납입금, 보장금, 투자 수익률을 기반으로 현재 가치와 미래 가치를 비교해 최적의 선택을 도와드립니다.",
  keywords: [
    "보험 해지 계산기",
    "보험 유지 vs 해지",
    "보험 투자 비교",
    "보험 현금가치",
    "보험 해지 환급금 투자",
  ],
  openGraph: {
    title: "보험 현금 가치 계산기",
    description: "보험 유지 vs 해지, 어떤 선택이 더 유리한지 계산해보세요",
  }
}

export default function Page() {
  const initialInput = {
    monthlyPremium: 100000,
    paymentYears: 30,
    elapsedYears: 0,
    currentAge: 35,
    maturityAge: 90,
    expectedClaimAge: 55,
    coverageAmount: 50000000,
    inflationRate: 0.03,
    expectedReturnRate: 0.09,
    surrenderValue: 0,
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">

      <header className="space-y-2">
        <h1 className="text-2xl font-bold">
          보험 현금가치 계산기
        </h1>
        <p className="text-sm text-gray-500">
          보험을 유지할지, 해지 후 투자할지 현금 가치 기준으로 비교합니다
        </p>
      </header>

      <InsuranceFormClient initialValue={initialInput} />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          보험을 유지하는 것이 좋을까요, 해지하고 투자하는 것이 좋을까요?
        </h2>

        <p className="text-sm text-gray-600 leading-relaxed">
          보험은 예상치 못한 질병이나 사고에 대비하기 위한 안전장치입니다.
          반면, 동일한 금액을 투자하면 시간이 지날수록 복리 효과로 자산이 증가할 수 있습니다.
        </p>

        <p className="text-sm text-gray-600 leading-relaxed">
          이 계산기는 매달 납입하는 보험료를 동일하게 투자한다고 가정하고,
          납입 기간 이후에는 복리로 자산이 성장하는 구조를 기반으로
          보험과 투자 결과를 비교합니다.
        </p>
      </section>

      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-sm text-gray-600">
        이 계산은 투자와 보험을 현금 가치 기준으로 비교한 시뮬레이션입니다.
        투자 수익률은 예상값이며 실제 결과는 달라질 수 있고,
        보험은 위험 발생 시 보장을 위한 상품입니다.
      </div>
    </main>
  )
}