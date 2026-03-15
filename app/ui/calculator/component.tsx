"use client"

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
  step,
  onChange,
}: {
  value: number
  step: number
  onChange: (v: number) => void
}) {
  const [text, setText] = React.useState(value.toString())

  React.useEffect(() => {
    setText(value.toString())
  }, [value])

  return (
    <input
      type="text"
      inputMode="decimal"
      value={text}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^0-9.]/g, "")
        setText(raw)

        const num = Number(raw)
        if (!Number.isNaN(num)) {
          onChange(num)
        }
      }}
      className="w-[160px] rounded-xl border border-gray-200 px-3 py-2 text-right text-sm outline-none focus:border-gray-400"
    />
  )
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
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  )
}

export function PercentInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <NumberInput2
      label={`${label} (%)`}
      value={value * 100}
      onChange={(v) => onChange(v / 100)}
    />
  )
}

export function NumberInput2({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="text-sm mb-1">{label}</div>
      <input
        type="number"
        value={value}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        className="w-full border rounded-lg px-3 py-2 text-right"
      />
    </div>
  )
}
