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
                  ? "border-2 border-blue-500 text-slate-900"
                  : "border border-slate-300 text-slate-600 hover:border-slate-400"
                }
              `}
            >
              <div className="font-semibold">{preset.label}</div>
              {preset.description && (
                <div className="text-xs">
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
              ? "border-2 border-blue-500 text-slate-900"
              : "border border-slate-300 text-slate-600 hover:border-slate-400"
            }
          `}
          onClick={() => setEditing(true)}
        >
          {!editing ? (
            <>
              <div className="font-semibold">직접 입력</div>
              <div className="text-xs">
                {value.toLocaleString()}
                {unit}
              </div>
            </>
          ) : (
            <div className="mt-2 min-w-0 relative">
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
                  px-2 py-1 pr-12 text-sm leading-tight h-8
                  focus:outline-none focus:ring-2 focus:ring-blue-200
                "
              />

              {unit && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
                  {unit}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
