import { summarizeLoan, type RepaymentType } from "@/app/lib/calculator/calc"

export function calculateLoanCapacity(params: {
  monthlyLimit: number
  annualRate: number
  years: number
  repayment: RepaymentType
}) {
  const { monthlyLimit, annualRate, years, repayment } = params

  if (monthlyLimit <= 0) return 0

  let low = 0
  let high = 3_000_000_000
  let result = 0

  for (let i = 0; i < 70; i++) {
    const mid = (low + high) / 2
    const summary = summarizeLoan({
      principal: mid,
      annualRate,
      years,
      repayment,
    })

    if (summary.monthlyPayment > monthlyLimit) {
      high = mid
    } else {
      result = mid
      low = mid
    }
  }

  return Math.floor(result)
}