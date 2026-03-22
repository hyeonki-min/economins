"use client"

import { InsuranceInput } from "@/app/lib/definitions"
import { AgeInput, DurationInput, Field, MoneyInput, PercentInput } from "@/app/ui/calculator/component"


export function InsuranceForm({
  value,
  onChange,
}: {
  value: InsuranceInput
  onChange: (v: InsuranceInput) => void
}) {
  function update<K extends keyof InsuranceInput>(key: K, v: number) {
    let next = { ...value, [key]: v }

    // 🔥 납입기간 줄어들면 elapsed도 같이 clamp
    if (key === "paymentYears") {
      next.elapsedYears = Math.min(next.elapsedYears, v)
    }

    onChange(next)
  }

  return (
    <div className="rounded-xl border border-gray-200 p-5 bg-white space-y-5">

      <Field label="현재 나이">
        <AgeInput
          value={value.currentAge}
          onChange={(v) => update("currentAge", v)}
          minAge={0}
          maxAge={120}
        />
      </Field>

      <Field label="만기 나이">
        <AgeInput
          value={value.maturityAge}
          onChange={(v) => update("maturityAge", v)}
          minAge={value.currentAge}
          maxAge={120}
        />
      </Field>

      <Field label="월 보험료">
        <MoneyInput
          value={value.monthlyPremium}
          onChange={(v) => update("monthlyPremium", v)}
        />
      </Field>

      <Field label="납입기간">
        <DurationInput
          value={value.paymentYears}
          onChange={(v) => update("paymentYears", v)}
          min={0}
          max={50}
        />
      </Field>

      <Field label="이미 납입한 기간">
        <DurationInput
          value={value.elapsedYears}
          onChange={(v) => update("elapsedYears", v)}
          min={0}
          max={value.paymentYears}
        />
      </Field>

      <Field label="보장금액">
        <MoneyInput
          value={value.coverageAmount}
          onChange={(v) => update("coverageAmount", v)}
        />
      </Field>

      <Field label="예상 보험금 수령 나이">
        <AgeInput
          value={value.expectedClaimAge}
          onChange={(v) => update("expectedClaimAge", v)}
          minAge={value.currentAge}
          maxAge={value.maturityAge}
        />
      </Field>

      <Field
        label="예상 투자 수익률"
        description="
          연 평균 기대 수익률 (예: S&amp;P500 약 9%).
          보험료만큼 매달 투자 후, 납입 종료 이후에는 복리로 운용합니다
        "
      >
        <PercentInput
          value={value.expectedReturnRate * 100}
          onChange={(v) => update("expectedReturnRate", v / 100)}
          min={0}
          max={100}
        />
      </Field>

      <Field
        label="해지환급금 (선택)"
        description="현재 해지 시 받을 수 있는 금액"
      >
        <MoneyInput
          value={value.surrenderValue ?? 0}
          onChange={(v) => update("surrenderValue", v)}
        />
      </Field>

      <Field label="물가상승률">
        <PercentInput
          value={value.inflationRate * 100}
          onChange={(v) => update("inflationRate", v / 100)}
          min={0}
          max={50}
        />
      </Field>

    </div>
  )
}