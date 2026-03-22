import { InsuranceCompareResult } from "@/app/lib/definitions"


export function SummaryCards({ r }: { r: InsuranceCompareResult }) {
  return (
    <div className="grid grid-cols-2 gap-4">

      <Card label="지금까지 낸 돈" value={format(r.paidSoFarNominal)} />
      <Card label="앞으로 낼 돈" value={format(r.remainingNominal)} />

      <Card label="총 납입금" value={format(r.totalNominal)} />

    </div>
  )
}

function Card({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 bg-white">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold mt-1 tabular-nums">
        {value}
      </div>
    </div>
  )
}

function format(n: number) {
  return `${Math.round(n).toLocaleString()}원`
}