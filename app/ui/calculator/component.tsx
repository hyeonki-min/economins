"use client"

import { format, formatMoney, sanitize, unformat } from "@/app/lib/utils"
import React from "react"

type Props = {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

export function TogglePill({ active, onClick, children }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-3 py-1.5 rounded-full text-sm border transition",
        active
          ? "bg-black text-white border-black"
          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

export function HighlightCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-gray-900">{value}</div>
      {sub && <div className="mt-1 text-xs text-gray-500">{sub}</div>}
    </div>
  )
}


export function Card({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="text-base font-semibold">{title}</h2>
      {children}
    </section>
  )
}

export function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm text-gray-700">{label}</div>
      <div className="min-w-[160px] flex justify-end text-right tabular-nums">{children}</div>
    </div>
  )
}

export function NumberInput({
  value,
  onChange,
  suffix,
}: {
  value: number
  onChange: (v: number) => void
  suffix?: string
}) {
  const [text, setText] = React.useState(format(value))
  const [isEditing, setIsEditing] = React.useState(false)

  React.useEffect(() => {
    if (!isEditing) {
      setText(format(value))
    }
  }, [value, isEditing])

  return (
    <div className="flex items-center gap-2 border rounded-xl px-3 py-2 focus-within:border-gray-400 bg-white">
      <input
        type="text"
        inputMode="numeric"
        value={text}
        onFocus={() => {
          setIsEditing(true)
          setText(unformat(text))
        }}
        onBlur={() => {
          setIsEditing(false)
          const num = Number(text)
          setText(format(num))
        }}
        onChange={(e) => {
          const raw = sanitize(e.target.value)
          setText(raw)

          const num = Number(raw)
          if (!Number.isNaN(num)) {
            onChange(num)
          }
        }}
        className="
          flex-1 min-w-0
          text-right
          tabular-nums
          outline-none
        "
      />

      {suffix && (
        <span className="text-gray-500 text-sm whitespace-nowrap">
          {suffix}
        </span>
      )}
    </div>
  )
}

export function MoneyInput(props: {
  value: number
  onChange: (v: number) => void
}) {
  return <NumberInput {...props} suffix="원" />
}

export function PercentInput(props: {
  value: number
  onChange: (v: number) => void
}) {
  return <NumberInput {...props} suffix="%" />
}

export function IntInput({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [text, setText] = React.useState(value.toString())

  React.useEffect(() => {
    setText(value.toString())
  }, [value])

  return (
    <input
      type="text"
      inputMode="numeric"
      value={text}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^\d]/g, "")
        setText(raw)

        if (raw === "") {
          onChange(0)
        } else {
          onChange(Number(raw))
        }
      }}
      className="
        w-[120px]
        text-right
        text-sm
        font-medium
        tabular-nums
        border
        border-gray-200
        rounded-md
        px-2
        py-1
      "
    />
  )
}

export function SummaryCards({
  title,
  rows,
}: {
  title: string
  rows: Array<[string, string]>
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rows.map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-gray-100 p-4">
            <div className="text-xs text-gray-500">{k}</div>
            <div className="mt-1 text-lg font-bold break-keep tabular-nums">{v}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function MiniStat({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="rounded-2xl border border-gray-100 p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-lg font-bold">{value}</div>
      {sub ? <div className="text-xs text-gray-500 mt-1">{sub}</div> : null}
    </div>
  )
}

export function ResultRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <span className="text-base font-semibold tabular-nums">{value}</span>
    </div>
  )
}

export function InputRow({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm text-gray-700">
          {label}
        </label>

        <div className="w-[160px] shrink-0 flex justify-end">
          {children}
        </div>
      </div>

      {hint && (
        <div className="text-xs text-gray-500">
          {hint}
        </div>
      )}
    </div>
  )
}


type ResultRowWithBarProp = {
  name: string;
  value: number;
  base: number;
  max: number;
  highlight?: boolean;
};

export function ResultRowWithBar({
  name,
  value,
  base,
  max,
  highlight,
}: ResultRowWithBarProp) {
  const ratio = value / base;
  const percent = (ratio - 1) * 100;
  const width = (value / max) * 100;

  return (
    <div className="space-y-2">

      <div className="flex justify-between items-end">
        <div
          className={`text-sm ${
            highlight ? "text-red-500 font-semibold" : "text-gray-600"
          }`}
        >
          {name}
        </div>

        <div className="text-right">
          <div className="text-lg font-semibold tabular-nums">
            {formatMoney(value)}
          </div>

          <div
            className={`text-xs tabular-nums ${
              percent >= 0 ? "text-red-500" : "text-blue-600"
            }`}
          >
            {percent >= 0 ? "+" : ""}
            {percent.toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            highlight ? "bg-red-500" : "bg-gray-900"
          }`}
          style={{ width: `${width}%` }}
        />
      </div>

    </div>
  );
}