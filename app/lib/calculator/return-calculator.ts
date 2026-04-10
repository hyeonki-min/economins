export type CalculationMode = "TARGET_TO_PERIOD" | "PERIOD_TO_TOTAL"

export function toDecimal(percent: number): number {
  return percent / 100
}

export function toPercent(decimal: number): number {
  return decimal * 100
}

/**
 * 목표 수익률(R)과 기간 수(n)으로
 * 매 기간 필요한 수익률(r)을 계산
 *
 * (1 + r)^n = 1 + R
 * r = (1 + R)^(1/n) - 1
 */
export function getPeriodRateFromTarget(
  targetReturnPercent: number,
  periods: number
): number {
  if (periods <= 0) return 0

  const targetDecimal = toDecimal(targetReturnPercent)
  const periodDecimal = Math.pow(1 + targetDecimal, 1 / periods) - 1

  return toPercent(periodDecimal)
}

/**
 * 기간별 수익률(r)과 반복 횟수(n)로
 * 최종 누적 수익률(R)을 계산
 *
 * R = (1 + r)^n - 1
 */
export function getTotalReturnFromPeriodRate(
  periodRatePercent: number,
  periods: number
): number {
  if (periods <= 0) return 0

  const rateDecimal = toDecimal(periodRatePercent)
  const totalDecimal = Math.pow(1 + rateDecimal, periods) - 1

  return toPercent(totalDecimal)
}

/**
 * 단순 합산 수익률
 * 예: 3% * 4회 = 12%
 */
export function getSimpleReturn(
  periodRatePercent: number,
  periods: number
): number {
  return periodRatePercent * periods
}

/**
 * 복리 효과 차이
 * 실제 누적 - 단순 합산
 */
export function getCompoundingEffect(
  periodRatePercent: number,
  periods: number
): number {
  const total = getTotalReturnFromPeriodRate(periodRatePercent, periods)
  const simple = getSimpleReturn(periodRatePercent, periods)
  return total - simple
}

export function getTargetReturnFromAmount(
  presentValue: number,
  futureValue: number
): number {
  if (presentValue <= 0) return 0

  const ratio = futureValue / presentValue
  return (ratio - 1) * 100
}

export function getMultiple(
  presentValue: number,
  futureValue: number
): number {
  if (presentValue <= 0) return 0
  return futureValue / presentValue
}