"use client"

import { useEffect, useRef, useState } from "react"

type Preset = {
  label: string
  value: number
  description?: string
}

type NumericInputCardProps = {
  title: string
  value: number
  unit?: string
  presets?: Preset[]
  min?: number
  max?: number
  onChange: (value: number) => void
}

export function NumericInputCard({
  title,
  value,
  unit,
  presets = [],
  min,
  max,
  onChange,
}: NumericInputCardProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value.toString())
  const inputRef = useRef<HTMLInputElement>(null)

  const presetValues = presets.map(p => p.value)
  const isCustomValue = !presetValues.includes(value)

  useEffect(() => {
    if (!editing) {
      setDraft(value.toString())
    }
  }, [value, editing])

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  const commit = () => {
    const parsed = Number(draft.replace(/[^\d]/g, ""))
    if (
      !Number.isNaN(parsed) &&
      (min === undefined || parsed >= min) &&
      (max === undefined || parsed <= max)
    ) {
      onChange(parsed)
    }
    setEditing(false)
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-slate-500">
        {title}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* presets */}
        {presets.map(preset => {
          const selected = preset.value === value

          return (
            <button
              key={preset.value}
              onClick={() => {
                onChange(preset.value)
                setEditing(false)
              }}
              className={`
                rounded-lg border p-3 text-left transition
                ${selected
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                  : "border-slate-300 hover:bg-slate-100"}
              `}
            >
              <div className="font-semibold">{preset.label}</div>
              {preset.description && (
                <div className="text-xs text-slate-500">
                  {preset.description}
                </div>
              )}
            </button>
          )
        })}

        {/* direct input */}
        <div
          className={`
            rounded-lg border p-3 transition h-16 min-w-0
            ${editing || isCustomValue
              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
              : "border-slate-300 hover:bg-slate-100 cursor-pointer"}
          `}
          onClick={() => setEditing(true)}
        >
          {!editing ? (
            <>
              <div className="font-semibold">직접 입력</div>
              <div className="text-xs text-slate-500">
                {value.toLocaleString()}
                {unit}
              </div>
            </>
          ) : (
            <div className="mt-2 min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) =>
                setDraft(e.target.value.replace(/[^\d]/g, ""))
              }
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit()
                if (e.key === "Escape") setEditing(false)
              }}
              className="
                w-full min-w-0 box-border rounded-md border border-slate-300
                px-2 py-1 text-sm leading-tight h-8
                focus:outline-none focus:ring-2 focus:ring-blue-200
              "
            />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
