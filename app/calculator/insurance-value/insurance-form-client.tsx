"use client"

import { calculateInsuranceCompare, sanitizeInput } from "@/app/lib/calculator/calculate-insurance"
import { InsuranceInput } from "@/app/lib/definitions"
import { useMemo, useState } from "react"
import { InsuranceForm } from "./insurance-form"
import { SummaryCards } from "./insurance-result"
import { InsightMessage } from "./insight-message"
import { CompareCards } from "./compare-cards"

export function InsuranceFormClient({
  initialValue,
}: {
  initialValue: InsuranceInput
}) {
  const [input, setInput] = useState(initialValue)

  const result = useMemo(() => {
      const safe = sanitizeInput(input)
      return calculateInsuranceCompare(safe)
    }, [input])

  return (
    <div className="space-y-8">

      <InsuranceForm value={input} onChange={setInput} />

      <SummaryCards r={result} />
      <InsightMessage r={result} />
      <CompareCards r={result} />

    </div>
  )
}