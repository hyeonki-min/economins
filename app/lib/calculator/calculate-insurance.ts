import {
  InsuranceInput,
  InsuranceCompareResult,
} from "@/app/lib/definitions"

export function calculateInsuranceCompare(
  input: InsuranceInput
): InsuranceCompareResult {
  const {
    monthlyPremium,
    paymentYears,
    elapsedYears,
    currentAge,
    expectedClaimAge,
    coverageAmount,
    inflationRate,
    expectedReturnRate,
    surrenderValue = 0,
  } = input

  const elapsedMonths = elapsedYears * 12
  const paymentMonths = paymentYears * 12

  const remainingMonths = Math.max(0, paymentMonths - elapsedMonths)

  const yearsToClaim = Math.max(0, expectedClaimAge - currentAge)

  const remainingYears = Math.max(0, paymentYears - elapsedYears)

  const investYears = Math.min(remainingYears, yearsToClaim)
  const growthYears = Math.max(0, yearsToClaim - investYears)

  const monthlyRate =
    Math.pow(1 + expectedReturnRate, 1 / 12) - 1

  // 1. 납입
  const paidSoFarNominal = monthlyPremium * elapsedMonths
  const remainingNominal = monthlyPremium * remainingMonths
  const totalNominal = paidSoFarNominal + remainingNominal

  // 1. 납입기간 동안 투자
  const investMonths = investYears * 12

  let investedFV = 0

  if (monthlyRate === 0) {
    investedFV = monthlyPremium * investMonths
  } else {
    investedFV =
      monthlyPremium *
      ((Math.pow(1 + monthlyRate, investMonths) - 1) /
        monthlyRate)
  }

  // 2. 이후 복리 성장
  const growthFactor = Math.pow(
    1 + expectedReturnRate,
    growthYears
  )

  let investmentFutureValue = investedFV * growthFactor

  // 3. 해지환급금
  investmentFutureValue +=
    surrenderValue *
    Math.pow(1 + expectedReturnRate, yearsToClaim)

  // 4. 보험
  const coverageFutureValue = coverageAmount

  const coveragePresentValue =
    coverageAmount /
    Math.pow(1 + inflationRate, yearsToClaim)

  const investmentPresentValue =
    investmentFutureValue /
    Math.pow(1 + inflationRate, yearsToClaim)

  return {
    paidSoFarNominal,
    remainingNominal,
    totalNominal,
    yearsToClaim,
    coverageFutureValue,
    coveragePresentValue,
    investmentFutureValue,
    investmentPresentValue,
    differencePV:
      investmentPresentValue - coveragePresentValue,
    ratio:
      investmentPresentValue / coveragePresentValue,
  }
}

export function sanitizeInput(input: InsuranceInput): InsuranceInput {
  const { currentAge, maturityAge, expectedClaimAge } = input

  let safeClaimAge = expectedClaimAge

  // 현재 나이보다 작으면 보정
  if (safeClaimAge < currentAge) {
    safeClaimAge = currentAge
  }

  // 만기보다 크면 보정
  if (safeClaimAge > maturityAge) {
    safeClaimAge = maturityAge
  }

  return {
    ...input,
    expectedClaimAge: safeClaimAge,
  }
}