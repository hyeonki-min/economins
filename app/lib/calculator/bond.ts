export type RegionType = "capital" | "local"

export function getBondRate(amount: number, region: RegionType) {
  const table = [
    { min: 20_000_000, max: 50_000_000, capital: 0.013, local: 0.013 },
    { min: 50_000_000, max: 100_000_000, capital: 0.019, local: 0.014 },
    { min: 100_000_000, max: 160_000_000, capital: 0.021, local: 0.016 },
    { min: 160_000_000, max: 260_000_000, capital: 0.023, local: 0.018 },
    { min: 260_000_000, max: 600_000_000, capital: 0.026, local: 0.021 },
    { min: 600_000_000, max: Number.POSITIVE_INFINITY, capital: 0.031, local: 0.026 },
  ]

  const found = table.find((row) => amount >= row.min && amount < row.max)
  if (!found) return 0

  return region === "capital" ? found.capital : found.local
}

export function calculateBondCost(
  loanAmount: number,
  region: RegionType,
  discountRate = 0.12,
  tradingFeeRate = 0.0005
) {
  const bondMax = loanAmount * 1.2
  const bondRate = getBondRate(bondMax, region)
  const bondPurchase = bondMax * bondRate
  const discountCost = bondPurchase * discountRate
  const tradingFee = bondPurchase * tradingFeeRate

  return {
    bondMax,
    bondRate,
    bondPurchase,
    discountCost,
    tradingFee,
    totalCost: discountCost + tradingFee,
  }
}