"use client"

import { useMemo, useState } from "react"
import {
  getCompoundingEffect,
  getMultiple,
  getPeriodRateFromTarget,
  getSimpleReturn,
  getTargetReturnFromAmount,
  getTotalReturnFromPeriodRate,
} from "@/app/lib/calculator/return-calculator"
import { formatNumber, formatPercent } from "@/app/lib/utils"
import { NumberInput } from "@/app/ui/calculator/component"

type Unit = "회" | "개월" | "년"

function Card({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
      </div>

      <div className="mt-6">{children}</div>
    </section>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-gray-800">{label}</label>
        {hint ? <span className="text-xs text-gray-400">{hint}</span> : null}
      </div>

      <div className="mt-2">{children}</div>
    </div>
  )
}

function UnitSegment({
  value,
  onChange,
}: {
  value: Unit
  onChange: (value: Unit) => void
}) {
  const options: Unit[] = ["회", "개월", "년"]

  return (
    <div className="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1">
      {options.map((option) => {
        const active = option === value

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={[
              "rounded-xl px-4 py-2 text-sm font-medium transition",
              active
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-800",
            ].join(" ")}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

function ResultPanel({
  eyebrow,
  value,
  description,
}: {
  eyebrow: string
  value: string
  description?: string
}) {
  return (
    <div className="rounded-3xl bg-gray-50 p-5 sm:p-6">
      <p className="text-sm font-medium text-gray-500">{eyebrow}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
        {value}
      </p>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-gray-500">{description}</p>
      ) : null}
    </div>
  )
}

function InfoRow({
  label,
  value,
  emphasize = false,
}: {
  label: string
  value: string
  emphasize?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={[
          "text-sm tabular-nums",
          emphasize ? "font-semibold text-gray-900" : "font-medium text-gray-700",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  )
}

export default function ProfitCalculatorClient() {

  const [periodRate, setPeriodRate] = useState(3)
  const [repeatCount, setRepeatCount] = useState(4)
  const [repeatUnit, setRepeatUnit] = useState<Unit>("회")
    const [presentValue, setPresentValue] = useState(1000000)
    const [futureValue, setFutureValue] = useState(2000000)
    const [periods, setPeriods] = useState(12)
    const [unit, setUnit] = useState<Unit>("개월")

    // 🔥 자동 계산
    const targetReturn = useMemo(() => {
    return getTargetReturnFromAmount(presentValue, futureValue)
    }, [presentValue, futureValue])

    const requiredPeriodRate = useMemo(() => {
    return getPeriodRateFromTarget(targetReturn, periods)
    }, [targetReturn, periods])

    const multiple = useMemo(() => {
    return getMultiple(presentValue, futureValue)
    }, [presentValue, futureValue])

  const totalReturn = useMemo(() => {
    return getTotalReturnFromPeriodRate(periodRate, repeatCount)
  }, [periodRate, repeatCount])

  const simpleReturn = useMemo(() => {
    return getSimpleReturn(periodRate, repeatCount)
  }, [periodRate, repeatCount])

  const compoundingEffect = useMemo(() => {
    return getCompoundingEffect(periodRate, repeatCount)
  }, [periodRate, repeatCount])

  return (
    <div className="space-y-6">
        <Card
        title="금액 기준 → 필요 수익률"
        description="현재 금액과 목표 금액을 입력하면, 목표 달성을 위한 수익률을 복리 기준으로 계산합니다."
        >
        <div className="grid gap-4 sm:grid-cols-2">
            <Field label="현재 금액">
            <NumberInput
                value={presentValue}
                onChange={setPresentValue}
                suffix="원"
            />
            </Field>

            <Field label="목표 금액">
            <NumberInput
                value={futureValue}
                onChange={setFutureValue}
                suffix="원"
            />
            </Field>
        </div>

        <div className="mt-4">
            <Field label="기간">
            <NumberInput
                value={periods}
                onChange={setPeriods}
                suffix={unit}
                min={1}
                decimalScale={0}
            />
            </Field>
        </div>

        <div className="mt-4">
            <Field label="기간 단위">
            <UnitSegment value={unit} onChange={setUnit} />
            </Field>
        </div>

        <div className="mt-6 space-y-4">
            <ResultPanel
            eyebrow="목표 수익률"
            value={`${formatPercent(targetReturn)}%`}
            description={`${formatPercent(targetReturn)}% 수익이 필요합니다.`}
            />

            <ResultPanel
            eyebrow="매 기간 필요한 수익률"
            value={`${formatPercent(requiredPeriodRate)}%`}
            description={`${periods}${unit} 동안 매 기간 약 ${formatPercent(
                requiredPeriodRate
            )}% 필요`}
            />
        </div>

        <div className="mt-6 rounded-2xl bg-indigo-50 px-4 py-4 text-center">
            <p className="text-sm text-indigo-600">성장 배수</p>
            <p className="mt-1 text-2xl font-semibold text-indigo-900">
            {multiple.toFixed(2)}배
            </p>
        </div>
        </Card>

      <Card
        title="기간별 수익률 → 최종 누적 수익률"
        description="같은 수익률을 여러 번 반복했을 때, 단순 합산이 아닌 복리 기준으로 최종 수익률을 계산합니다."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="기간별 수익률">
            <NumberInput
              value={periodRate}
              onChange={setPeriodRate}
              suffix="%"
            />
          </Field>

          <Field label="반복 횟수">
            <NumberInput
              value={repeatCount}
              onChange={setRepeatCount}
              suffix={repeatUnit}
              min={1}
              decimalScale={0}
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="반복 단위">
            <UnitSegment value={repeatUnit} onChange={setRepeatUnit} />
          </Field>
        </div>

        <div className="mt-6">
          <ResultPanel
            eyebrow="최종 누적 수익률"
            value={`${formatPercent(totalReturn)}%`}
            description={`${formatPercent(periodRate)}% 수익률을 ${formatNumber(
              repeatCount
            )}${repeatUnit} 반복하면 최종 수익률은 ${formatPercent(
              totalReturn
            )}%입니다.`}
          />
        </div>

        <div className="mt-6 divide-y divide-gray-100 rounded-3xl border border-gray-200 bg-white px-5">
          <InfoRow
            label="단순 합산 수익률"
            value={`${formatPercent(simpleReturn)}%`}
          />
          <InfoRow
            label="복리 기준 실제 수익률"
            value={`${formatPercent(totalReturn)}%`}
            emphasize
          />
          <InfoRow
            label="복리 효과 차이"
            value={`${formatPercent(compoundingEffect)}%p`}
          />
        </div>

        <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          예를 들어 3% 수익률을 4번 반복하면 단순 계산은 12%지만,
          실제 복리 기준 누적 수익률은 {formatPercent(totalReturn)}%입니다.
        </div>
      </Card>
    </div>
  )
}