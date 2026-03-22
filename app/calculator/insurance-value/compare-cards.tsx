import { InsuranceCompareResult } from "@/app/lib/definitions"

export function CompareCards({ r }: { r: InsuranceCompareResult }) {
  return (
    <div className="space-y-6">

      <Section title={`${r.yearsToClaim}년 후 기준`} highlight>
        <BigCard
          label="보험 보장금"
          value={format(r.coverageFutureValue)}
        />
        <BigCard
          label="투자 시 예상 금액"
          value={format(r.investmentFutureValue)}
        />
      </Section>

      {/* 현재 가치 */}
      <Section title="지금 기준 비교 (물가 반영)">
        <SubCard
          label="보험 (지금 기준)"
          value={format(r.coveragePresentValue)}
        />
        <SubCard
          label="투자 결과 (지금 기준)"
          value={format(r.investmentPresentValue)}
        />
        <p className="text-xs text-gray-400 col-span-2">
            ※ 미래 금액을 현재 가치로 환산한 금액입니다
        </p>
      </Section>

      {/* 비교 */}
      <Section title="비교">
        <SubCard
          label="얼마 더 유리한가"
          value={format(r.differencePV)}
        />
        <SubCard
        label="투자 우위"
        value={`${r.ratio.toFixed(2)}배`}
        />
      </Section>
        <div className="rounded-xl bg-gray-900 text-white p-5 text-center">
        <div className="text-sm opacity-80">
            현재 조건 기준
        </div>

        <div className="text-lg font-semibold mt-1">
            👉 이 보험은 {r.ratio > 1 ? "유지보다 투자" : "유지"}가 더 유리합니다
        </div>
        </div>
    </div>
  )
}

function Section({
  title,
  children,
  highlight,
}: {
  title: string
  children: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div className="space-y-3">
      <h3
        className={`text-sm font-semibold ${
          highlight ? "text-gray-900" : "text-gray-600"
        }`}
      >
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  )
}
function BigCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-gray-300 p-5 bg-white">
      <div className="text-xs text-gray-500">{label}</div>

      <div className="text-2xl font-bold mt-2 tabular-nums">
        {value}
      </div>
    </div>
  )
}
function SubCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 bg-white">
      <div className="text-xs text-gray-500">{label}</div>

      <div className="text-base font-semibold mt-1 tabular-nums">
        {value}
      </div>
    </div>
  )
}
function format(n: number) {
  return `${Math.round(n).toLocaleString()}원`
}