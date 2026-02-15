"use client"


type AgeRangeSliderProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function AgeRangeSlider({
  value,
  onChange,
  min = 20,
  max = 60,
}: AgeRangeSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-slate-600">
        <span>{min}세</span>
        <span className="font-semibold text-slate-800">
          {value}세
        </span>
        <span>{max}세</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        className="w-full accent-blue-600 cursor-pointer"
      />
    </div>
  )
}
