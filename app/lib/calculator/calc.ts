export type RepaymentType = "ANNUITY" | "EQUAL_PRINCIPAL" | "BULLET"

export type LoanInput = {
  principal: number
  annualRate: number
  years: number
  repayment: RepaymentType
}

export type FeesInput = {
  amount: number
}

export type LoanSummary = {
  monthlyPayment: number
  totalInterest: number
  totalPayment: number
  totalCostWithFees: number
  remainingPrincipalAtYear10: number | null
}

const toMonthlyRate = (annualRatePct: number) => annualRatePct / 100 / 12

export function summarizeLoan(
  input: LoanInput,
  fees?: FeesInput
): LoanSummary {
  const P = Math.max(0, Math.floor(input.principal))
  const n = Math.max(1, Math.floor(input.years * 12))
  const r = toMonthlyRate(input.annualRate)
  const feeAmount = fees?.amount ?? 0

  if (P === 0) {
    return {
      monthlyPayment: 0,
      totalInterest: 0,
      totalPayment: 0,
      totalCostWithFees: feeAmount,
      remainingPrincipalAtYear10: 0,
    }
  }

  if (r === 0) {
    const monthly = input.repayment === "BULLET" ? 0 : P / n
    const totalPayment = P
    const remainingAt10 =
      input.repayment === "BULLET"
        ? P
        : Math.max(0, P - (P / n) * Math.min(120, n))

    return {
      monthlyPayment: monthly,
      totalInterest: 0,
      totalPayment,
      totalCostWithFees: totalPayment + feeAmount,
      remainingPrincipalAtYear10: n >= 120 ? remainingAt10 : null,
    }
  }

  let totalInterest = 0
  let totalPayment = 0
  let monthlyPaymentRepresentative = 0
  let remainingAt10y: number | null = null

  if (input.repayment === "ANNUITY") {
    const pow = Math.pow(1 + r, n)
    const payment = (P * r * pow) / (pow - 1)
    monthlyPaymentRepresentative = payment

    let balance = P
    for (let m = 1; m <= n; m++) {
      const interest = balance * r
      const principalPaid = payment - interest
      balance = Math.max(0, balance - principalPaid)

      totalInterest += interest
      totalPayment += payment

      if (m === 120) remainingAt10y = balance
    }
  } else if (input.repayment === "EQUAL_PRINCIPAL") {
    const principalPaidFixed = P / n
    monthlyPaymentRepresentative = principalPaidFixed + P * r

    let balance = P
    for (let m = 1; m <= n; m++) {
      const interest = balance * r
      const payment = principalPaidFixed + interest
      balance = Math.max(0, balance - principalPaidFixed)

      totalInterest += interest
      totalPayment += payment

      if (m === 120) remainingAt10y = balance
    }
  } else {
    monthlyPaymentRepresentative = P * r
    totalInterest = monthlyPaymentRepresentative * n
    totalPayment = totalInterest + P
    remainingAt10y = n >= 120 ? P : null
  }

  return {
    monthlyPayment: monthlyPaymentRepresentative,
    totalInterest,
    totalPayment,
    totalCostWithFees: totalPayment + feeAmount,
    remainingPrincipalAtYear10: remainingAt10y,
  }
}

export type RatePath = number[]

export type VariableLoanInput = Omit<LoanInput, "annualRate"> & {
  ratePath: RatePath
}

export function simulateAnnuityWithRatePath(
  input: VariableLoanInput
): LoanSummary {
  const P0 = Math.max(0, Math.floor(input.principal))
  const n = Math.max(1, Math.floor(input.years * 12))
  const path = input.ratePath.slice(0, n)

  while (path.length < n) path.push(path[path.length - 1] ?? 0)

  let balance = P0
  let totalInterest = 0
  let totalPayment = 0
  let remainingAt10y: number | null = null
  let firstPayment = 0

  for (let m = 1; m <= n; m++) {
    const annual = Math.min(99, Math.max(0, path[m - 1] ?? 0))
    const r = toMonthlyRate(annual)
    const remain = n - (m - 1)

    let payment = 0
    if (r === 0) {
      payment = balance / remain
    } else {
      const pow = Math.pow(1 + r, remain)
      payment = (balance * r * pow) / (pow - 1)
    }

    if (m === 1) firstPayment = payment

    const interest = balance * r
    const principalPaid = payment - interest
    balance = Math.max(0, balance - principalPaid)

    totalInterest += interest
    totalPayment += payment

    if (m === 120) remainingAt10y = balance
  }

  return {
    monthlyPayment: firstPayment,
    totalInterest,
    totalPayment,
    totalCostWithFees: totalPayment,
    remainingPrincipalAtYear10: remainingAt10y,
  }
}