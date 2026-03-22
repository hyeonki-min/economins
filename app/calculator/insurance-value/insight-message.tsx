import { InsuranceCompareResult } from "@/app/lib/definitions"
import { format, formatMoney } from "@/app/lib/utils"

export function InsightMessage({ r }: { r: InsuranceCompareResult }) {
  const ratio = r.ratio

  let title = ""
  let description = ""
  let conclusion = ""

  if (ratio < 0.7) {
    title = "초기 구간"
    description = "투자 기간이 짧아 자산이 충분히 쌓이지 않았습니다."
    conclusion = "이 시점에서는 보험이 더 유리합니다"
  } else if (ratio < 1.2) {
    title = "균형 구간"
    description = "투자와 보험의 가치가 비슷해지는 구간입니다."
    conclusion = "선택에 따라 결과가 달라질 수 있습니다"
  } else {
    title = "장기 구간"
    description = "시간이 지나며 투자 자산이 크게 성장했습니다."
    conclusion = "장기적으로는 투자가 더 유리할 수 있습니다"
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-5 shadow-sm">

        <div className="text-sm text-gray-500">
            {r.yearsToClaim}년 후 기준
        </div>

        {/* 🔥 결론 강화 */}
        <div className="space-y-2">
            <div className="text-base text-gray-700">
            {description}
            </div>

            <div className="text-xl font-bold">
            👉 {conclusion}
            </div>
        </div>

        {/* 🔥 핵심 비교 (더 강하게) */}
        <div className="grid grid-cols-2 gap-4 pt-2">

            <div className="rounded-xl bg-gray-50 p-4">
            <div className="text-xs text-gray-500">보험</div>
            <div className="text-2xl font-bold tabular-nums">
                {formatMoney(r.coverageFutureValue)}
            </div>
            </div>

            <div className="rounded-xl bg-blue-50 p-4">
            <div className="text-xs text-gray-500">투자 결과</div>
            <div className="text-2xl font-bold tabular-nums text-blue-700">
                {formatMoney(r.investmentFutureValue)}
            </div>
            </div>

        </div>

        {/* 🔥 현재가치 → 문장형 */}
        <div className="pt-3 border-t border-gray-200 text-sm text-gray-600">
            지금 기준으로 보면 약{" "}
            <span className="font-semibold">
            {formatMoney(r.investmentPresentValue)}
            </span>
            수준입니다
        </div>

        </div>
  )
}