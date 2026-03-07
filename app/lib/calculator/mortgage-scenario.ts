import type { RatePath } from "@/app/lib/calculator/calc"

export type ScenarioKey = "RISING" | "FALLING" | "RANGE"

export function buildScenarioRatePath(params: {
  months: number
  startRate: number
  scenario: ScenarioKey
}): RatePath {
  const { months, startRate, scenario } = params
  const path: number[] = []

  for (let i = 0; i < months; i++) {
    const year = Math.floor(i / 12)
    let rate = startRate

    if (scenario === "RISING") {
      rate = startRate + 0.5 * year
    } else if (scenario === "FALLING") {
      rate = year < 1 ? startRate : Math.max(1.0, startRate - 0.5 * year)
    } else {
      const wave = Math.sin(i / 6) * 0.2
      rate = Math.max(0, startRate + wave)
    }

    path.push(rate)
  }

  return path
}

export function buildHybrid5yRatePath(params: {
  months: number
  fixedRate: number
  variableStartRate: number
  scenario: ScenarioKey
}): RatePath {
  const { months, fixedRate, variableStartRate, scenario } = params
  const fixedMonths = Math.min(60, months)

  return [
    ...Array.from({ length: fixedMonths }, () => fixedRate),
    ...buildScenarioRatePath({
      months: Math.max(0, months - fixedMonths),
      startRate: variableStartRate,
      scenario,
    }),
  ]
}