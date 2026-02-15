"use client"

import { LifePlanState } from "@/app/lib/simulator/types"

type Props = {
  plan: LifePlanState
}

export function ScenarioSummaryCard({ plan }: Props) {
  return (
    <div
      className="
        sticky top-0 z-20
        rounded-xl border border-slate-200
        bg-white/90 backdrop-blur
        px-4 py-3
        shadow-sm
      "
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <SummaryItem
          label="근로시작"
          value={`${plan.age}세`}
        />
        <SummaryItem
          label="초봉"
          value={`${plan.salary.toLocaleString()}만원`}
        />
        <SummaryItem
          label="소비"
          value={`${Math.round(plan.consumptionRate * 100)}%`}
        />
        <SummaryItem
          label="결혼"
          value={`${plan.marriageAge}세`}
        />
        <SummaryItem
          label="자녀"
          value={`${plan.children}명`}
        />
        <SummaryItem
          label="투자"
          value={investmentLabel(plan.investment)}
        />
      </div>
    </div>
  )
}

function SummaryItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-1 text-slate-700">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function investmentLabel(type: LifePlanState["investment"]) {
  switch (type) {
    case "stable_plus":
      return "안정형"
    case "neutral":
      return "중립형"
    case "active":
      return "적극형"
    case "aggressive":
      return "공격형"
    default:
      return type
  }
}
