export function calcStampTaxKRW(loanAmount: number) {
  if (loanAmount <= 50_000_000) return 0
  if (loanAmount <= 100_000_000) return 70_000
  if (loanAmount <= 1_000_000_000) return 150_000
  return 350_000
}

export function calculateAcquisitionTax(
  price: number,
  includeRuralTax = true
) {
  const six = 600_000_000
  const nine = 900_000_000

  let taxRate = 0
  if (price <= six) {
    taxRate = 0.01
  } else if (price <= nine) {
    taxRate = 0.01 + ((price - six) / 300_000_000) * 0.02
  } else {
    taxRate = 0.03
  }

  const acquisitionTax = price * taxRate
  const educationTax = acquisitionTax * 0.1
  const ruralTax = includeRuralTax ? acquisitionTax * 0.2 : 0

  return {
    taxRate,
    acquisitionTax,
    educationTax,
    ruralTax,
    total: acquisitionTax + educationTax + ruralTax,
  }
}

export function calculateBrokerageFee(price: number) {
  if (price <= 600_000_000) return price * 0.005
  if (price <= 900_000_000) return price * 0.004
  return price * 0.009
}