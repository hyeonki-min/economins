"use client"

import { AgeRangeSlider } from "@/app/ui/simulator/age-range-slider"


type AgeOptionCardProps = {
  value: number
  onChange: (value: number) => void
}

export function AgeOptionCard({
  value,
  onChange,
}: AgeOptionCardProps) {
  return (
    <div
      className="
        group grid grid-rows-[32px_1fr_auto]
        rounded-lg border border-slate-300
        p-4 text-slate-700
        hover:border-slate-400
        hover:bg-slate-100
        hover:shadow-sm
        transition
        focus-within:ring-2 focus-within:ring-blue-200
      "
    >
      {/* Title */}
      <div className="text-sm font-medium text-slate-500">
        현재 나이
      </div>

      {/* Slider */}
      <div className="mt-2">
        <AgeRangeSlider
          value={value}
          onChange={onChange}
        />
      </div>

      {/* Footer */}
      <div className="mt-2 text-xs text-slate-400">
        기준 시점을 설정합니다
      </div>
    </div>
  )
}
