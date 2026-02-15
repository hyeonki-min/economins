import { getNetIncomeRatio } from "@/app/lib/simulator/simple-finance-engine"

interface WealthPoint {
  age: number
  totalWealth: number
}

export function calculateWealthTimeline(
  startAge: number,
  currentAge: number,
  baseIncome = 5000,
  baseExpense = 250
): WealthPoint[] {

  const inflation = 0.03
  const investReturn = 0.04
  const threshold = 5000

  let wealth = 0
  let annualIncome = baseIncome
  const timeline: WealthPoint[] = []

  for (let age = startAge; age <= currentAge; age++) {

    const salaryGrowth =
      annualIncome <= threshold ? inflation : inflation / 2

    if (age !== startAge) {
      annualIncome *= (1 + salaryGrowth)
    }

    const ratio = getNetIncomeRatio(annualIncome)
    const monthlyNet = (annualIncome * ratio) / 12
    const monthlyExpense =
      baseExpense * Math.pow(1 + inflation, age - startAge)
    const monthlySaving = monthlyNet - monthlyExpense

    wealth = wealth * (1 + investReturn) + monthlySaving * 12

    timeline.push({
      age,
      totalWealth: Math.round(wealth),
    })
  }

  return timeline
}
