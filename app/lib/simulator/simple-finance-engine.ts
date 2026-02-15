import { FinanceCardData, HousingBaseType, InvestmentStyle, LifePlanState, WageGrowthParams } from "@/app/lib/simulator/types"

// 표준정규 CDF 근사 (Φ)
function normalCdf(x: number): number {
  // Abramowitz & Stegun 기반 erf 근사
  const sign = x < 0 ? -1 : 1
  const absX = Math.abs(x) / Math.SQRT2

  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const t = 1 / (1 + p * absX)
  const y =
    1 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) *
      Math.exp(-absX * absX)

  const erf = sign * y
  return 0.5 * (1 + erf)
}

export function wageGrowthRateDeterministic(
  monthlyIncome: number,
  {
    baseMonthlyMean = 400,
    monthlySigma = 150,
    gMin = 0.01,
    gMax,
  }: WageGrowthParams = {}
): number {
  // 기준(400만원)에서 4.6% 맞추기
  const targetAtMean = 0.046
  const resolvedGMax = gMax ?? (2 * targetAtMean - gMin) // = 0.092 - gMin

  const z = (monthlyIncome - baseMonthlyMean) / monthlySigma
  const w = 1 - normalCdf(z) // low income -> w↑, high income -> w↓

  const g = gMin + (resolvedGMax - gMin) * w
  return Math.max(0, g) // 마이너스 없음
}

export function nextAnnualIncomeDeterministic(
  annualIncome: number,
  params?: WageGrowthParams
): number {
  const monthlyIncome = annualIncome / 12
  const g = wageGrowthRateDeterministic(monthlyIncome, params)
  return annualIncome * (1 + g)
}

function consumptionElasticity(monthlyIncome: number) {
  const mean = 484
  const sigma = 150
  const Emax = 1.0
  const Emin = 0.5

  const z = (monthlyIncome - mean) / sigma
  const w = 1 - normalCdf(z) // 저소득 → w 큼

  return Emin + (Emax - Emin) * w
}

function maxLoanByPayment(monthlyPayment: number, annualRate: number) {
  const r = annualRate / 12
  const n = 360

  return (
    monthlyPayment *
    ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)))
  )
}

function calculateAffordableHouse(
  financialAssets: number,
  monthlyNet: number,
  monthlySaving: number,
  loanRate: number
) {
  const maxMonthlyByDSR = monthlyNet * 0.4
  const maxMonthlyBySaving = Math.max(0, monthlySaving)

  const affordableMonthlyPayment = Math.min(
    maxMonthlyByDSR,
    maxMonthlyBySaving
  )

  const maxLoanByDSR = maxLoanByPayment(affordableMonthlyPayment, loanRate)

  const maxHouseByCash = financialAssets / 0.3
  const maxHouseByLoan = maxLoanByDSR / 0.7

  const housePrice = Math.min(maxHouseByCash, maxHouseByLoan)
  const loanAmount = housePrice * 0.7
  const requiredCash = housePrice * 0.3
  return { housePrice, loanAmount, requiredCash }
}

function getLoanTermMonths(loanAmount: number): number {
  if (loanAmount <= 10000) return 120   // 10년
  if (loanAmount <= 20000) return 240   // 20년
  return 360                           // 30년
}

export const CHILD_BASE_MONTHLY_COST = 50     // 양육 기본비
export const ACADEMY_MONTHLY_COST = 50        // 학원비 (추가)

const MARRIAGE_COST = 1080 // 만원
const CONSUMER_DEBT_RATE = 0.09
const JEONSE_RETURN = 0.05
const STEP_YEARS = 4

function getHousingMonthlyCost(plan: LifePlanState): number {
  switch (plan.housingBase) {
    case "monthly":
      return plan.monthlyRent ?? 0
    case "jeonse":
    case "family":
    case "own":
    default:
      return 0
  }
}

function applyJeonseStepIncrease(
  baselineDeposit: number,
  yearsFromStart: number
) {
  const steps = Math.floor(yearsFromStart / STEP_YEARS)
  const stepFactor = Math.pow(1 + JEONSE_RETURN, STEP_YEARS)
  return baselineDeposit * Math.pow(stepFactor, steps)
}


export function calculateSimpleFinance(
  plan: LifePlanState,
  currentAge: number,
): FinanceCardData {

  const CHILD_INFLATION_RATE = 0.02
  const depositReturn = 0.028
  const etfReturn = 0.09
  const houseReturn = 0.06

  const startAge = plan.age
  const retireAge = plan.retirementAge
  const loanStartAge = plan.housingPurchaseAge ?? null
  const marriageAge = plan.marriageAge
  const childrenCount = plan.children
  const type = plan.investment

  const baseIncome = plan.salary
  const baseExpense = (plan.salary / 12) * plan.consumptionRate

  const ratioMap: Record<InvestmentStyle, { deposit: number; etf: number }> = {
    stable:        { deposit: 1.0, etf: 0.0 },
    stable_plus:   { deposit: 0.7, etf: 0.3 },
    neutral:       { deposit: 0.5, etf: 0.5 },
    active:        { deposit: 0.3, etf: 0.7 },
    aggressive:    { deposit: 0.0, etf: 1.0 },
  }

  // ===== 상태(절대값) =====
  let annualIncome = baseIncome

  let livingExpense = baseExpense

  let depositTotal = 0
  let etfTotal = 0

  let depositSaving = 0
  let etfSaving = 0
  let estimatedAnnualSaving = 0

  let rpDeposit = 0
  let rpEtf = 0
  let totalRp = 0

  let houseOwned = false
  let housePrice = 0
  let purchaseHousePrice = 0

  let mortgageOriginal = 0
  let remainingBalance = 0
  let loanRate = 0
  let r = 0 // monthly rate

  let consumerDebt = 0

  // 초기자산 세팅(절대값)
  if (plan.initialAsset.type === 'cash' && plan.initialAsset.amount) {
    const ratio = ratioMap[type]
    depositTotal = plan.initialAsset.amount * ratio.deposit
    etfTotal = plan.initialAsset.amount * ratio.etf
  }
  if (plan.housingBase === 'own' && plan.initialAsset.houseValue) {
    houseOwned = true
    housePrice = plan.initialAsset.houseValue
    purchaseHousePrice = plan.initialAsset.houseValue
  }

  // 시작 시점 baseline
  const baselineRemaining = remainingBalance
  const baselineConsumerDebt = consumerDebt

  // 🔵 전세/월세 보증금 baseline
  const baselineHousingDeposit =
    plan.housingBase === 'jeonse' || plan.housingBase === 'monthly'
      ? plan.initialAsset.deposit ?? 0
      : 0

  let currentHousingDeposit = baselineHousingDeposit

  // 🔵 부동산 순자산 baseline (자가만 해당)
  const baselineRealEstateEquity =
    plan.housingBase === 'own'
      ? plan.initialAsset.houseValue ?? 0
      : 0
  const baselineGrossAssets =
    depositTotal +
    etfTotal +
    baselineRealEstateEquity +
    baselineHousingDeposit
  const baselineNetWorth = baselineGrossAssets - baselineRemaining - baselineConsumerDebt

  // ===== 유틸: 특정 나이 시점의 월 스냅샷(누적 반영 X) =====
  function computeMonthlySnapshot(age: number) {    
    let rentExpense = 0
    let childExpense = 0
    let marriageExpense = 0

    // income at this age (annualIncome 변수는 "현재 age의 연봉" 상태로 유지될 예정)
    let ai = annualIncome
    if (age >= retireAge) ai = 0

    const ratio = getNetIncomeRatio(ai)
    const monthlyNet = (ai * ratio) / 12

    // 소비: "나이가 된 시점"에서는 연봉이 바뀌었으면 그에 맞춰 소비수준도 갱신된 값이 보이는게 자연스러움
    // 단, 누적 시뮬레이션을 흔들지 않기 위해 여기서는 livingExpense를 직접 변경하지 않고, local로 계산
    let le = livingExpense
    if (age >= startAge && age < retireAge) {
      const wageGrowth = wageGrowthRateDeterministic(ai / 12, {
        baseMonthlyMean: 400,
        monthlySigma: 150,
        gMin: 0.01,
      })
      const elasticity = consumptionElasticity(monthlyNet)
      le = le * (1 + wageGrowth * elasticity)
    }

    const firstChildBirthAge = marriageAge + 2

    // 👶 기본 양육비 (출생 이후)
    if (age >= firstChildBirthAge) {
      const yearsSinceBirth = age - firstChildBirthAge
      const inflationFactor = Math.pow(1 + CHILD_INFLATION_RATE, yearsSinceBirth)

      childExpense +=
        childrenCount *
        CHILD_BASE_MONTHLY_COST *
        inflationFactor
    }

    // 📚 학원비 (중·고등학생)
    if (age >= firstChildBirthAge + 8 && age <= firstChildBirthAge + 20) {
      const yearsSinceSchoolStart = age - (firstChildBirthAge + 8)
      const inflationFactor = Math.pow(1 + CHILD_INFLATION_RATE, yearsSinceSchoolStart)

      childExpense +=
        childrenCount *
        ACADEMY_MONTHLY_COST *
        inflationFactor
    }

    // 주택(거주) 비용
    const isBeforePurchase =
      !(plan.housingFuture === "buy" && loanStartAge !== null && age >= loanStartAge)

    if (isBeforePurchase) {
      rentExpense += getHousingMonthlyCost(plan)
    }

    // 결혼 비용(해당 나이 1년 동안 나눠 부담한다고 가정)
    if (age === marriageAge) {
      marriageExpense += MARRIAGE_COST / 12
    }

    // 대출 이자/원금: "해당 나이 시점의 1개월" (월 상환액 관점)
    let loanInterest = 0
    let loanPrincipal = 0
    let remainingLoan = remainingBalance

    if (mortgageOriginal > 0 && loanStartAge !== null) {
      const n = getLoanTermMonths(mortgageOriginal)
      const loanEndAge = loanStartAge + n / 12
      const k = Math.min(n, Math.max(0, (age - loanStartAge) * 12)) // age 시점까지 경과개월

      if (age >= loanStartAge && age < loanEndAge) {
        const monthlyPayment =
          mortgageOriginal * (r * Math.pow(1 + r, n)) /
          (Math.pow(1 + r, n) - 1)

        const balanceBefore =
          mortgageOriginal *
          (Math.pow(1 + r, n) - Math.pow(1 + r, k)) /
          (Math.pow(1 + r, n) - 1)

        loanInterest = balanceBefore * r
        loanPrincipal = monthlyPayment - loanInterest
        remainingLoan = Math.max(0, balanceBefore - loanPrincipal)
      } else {
        loanInterest = 0
        loanPrincipal = 0
        remainingLoan = 0
      }
    }

    const totalExpense = livingExpense + rentExpense + childExpense + marriageExpense + loanInterest + loanPrincipal
    const monthlySaving = Math.max(0, monthlyNet - totalExpense)

    return {
      ai,
      ratio,
      monthlyNet,
      livingExpense: le,
      totalExpense,
      childExpense,
      rentExpense,
      marriageExpense,
      monthlySaving,
      loanInterest,
      loanPrincipal,
      remainingLoan,
    }
  }

  // ===== 1년치 누적 시뮬레이션 (ageYear의 12개월을 반영해서 자산/부채를 증가시키고, 다음 해로 넘어감) =====
  function simulateOneYear(ageYear: number) {
    // 1) 해당 나이 시점 월 스냅샷(이 값으로 12개월 누적)
    const snap = computeMonthlySnapshot(ageYear)

    // 2) 퇴직연금(해당 나이 12개월 납입 + 연수익)
    if (ageYear < retireAge) {
      const rpMonthly = snap.ai / 12
      rpDeposit = rpDeposit * (1 + depositReturn) + rpMonthly * ratioMap[type].deposit
      rpEtf     = rpEtf     * (1 + etfReturn)     + rpMonthly * ratioMap[type].etf
      totalRp = rpDeposit + rpEtf
    }

    // 3) 대출/주택 구매 이벤트는 "그 나이 시작 시점"에 일어난다고 가정
    if (loanStartAge !== null && ageYear === loanStartAge) {
      loanRate = 0.0455
      r = loanRate / 12
      const jeonseDeposit = currentHousingDeposit
      const totalFinancialAssets =
          depositTotal + etfTotal + jeonseDeposit
      const affordable = calculateAffordableHouse(
        totalFinancialAssets,
        snap.monthlyNet,
        snap.monthlySaving,
        loanRate
      )
      mortgageOriginal = affordable.loanAmount
      remainingBalance = affordable.loanAmount
      housePrice = affordable.housePrice
      purchaseHousePrice = affordable.housePrice
      houseOwned = true
      
      const requiredCash = affordable.requiredCash

      if (totalFinancialAssets > 0) {
        const depositRatio = depositTotal / totalFinancialAssets
        const etfRatio = etfTotal / totalFinancialAssets
        const jeonseRatio = jeonseDeposit / totalFinancialAssets

        depositTotal -= requiredCash * depositRatio
        etfTotal     -= requiredCash * etfRatio
      }

      currentHousingDeposit = 0
    }

    // 4) 적자 처리(연 단위): 12개월치 적자면 자산에서 먼저 메꾸고 모자라면 소비성 부채로
    const monthlyDeficit = snap.totalExpense - snap.monthlyNet
    if (monthlyDeficit > 0) {
      const annualDeficit = monthlyDeficit * 12
      const available = depositTotal + etfTotal

      if (available >= annualDeficit) {
        const depositRatio = available > 0 ? depositTotal / available : 0
        depositTotal -= annualDeficit * depositRatio
        etfTotal     -= annualDeficit * (1 - depositRatio)
      } else {
        consumerDebt += (annualDeficit - available)
        depositTotal = 0
        etfTotal = 0
      }
    }

    // 5) 흑자 처리(연 단위): 12개월치 저축을 투자/상환
    const annualSaving = snap.monthlySaving * 12

    // 소비성 부채 상환(연저축의 30% 한도)
    if (annualSaving > 0 && consumerDebt > 0) {
      const pay = Math.min(annualSaving * 0.3, consumerDebt)
      consumerDebt -= pay
    }

    const investable = annualSaving - Math.min(annualSaving * 0.3, consumerDebt)
    const monthlyInvestable = investable / 12

    depositSaving = monthlyInvestable * ratioMap[type].deposit
    etfSaving = monthlyInvestable * ratioMap[type].etf
    const annualDepositSaving = depositSaving * 12
    const annualEtfSaving = etfSaving * 12
    // 연 수익 + 12개월 납입
    depositTotal = depositTotal * (1 + depositReturn) + annualDepositSaving
    etfTotal     = etfTotal     * (1 + etfReturn)     + annualEtfSaving

    // 6) 주택 가격 상승(보유 중이면 1년t치 상승)
    if (houseOwned) {
      housePrice *= (1 + houseReturn)
    }

    // 7) 대출 잔액: 1년(12개월) 경과 반영(간단히 "다음 나이 시점 잔액"으로 갱신)
    if (mortgageOriginal > 0 && loanStartAge !== null) {
      const n = getLoanTermMonths(mortgageOriginal)
      const loanEndAge = loanStartAge + n / 12
      const nextAge = ageYear + 1
      const kNext = Math.min(n, Math.max(0, (nextAge - loanStartAge) * 12))

      if (nextAge <= loanEndAge) {
        const balanceAtNext =
          mortgageOriginal *
          (Math.pow(1 + r, n) - Math.pow(1 + r, kNext)) /
          (Math.pow(1 + r, n) - 1)

        remainingBalance = Math.max(0, balanceAtNext)
      } else {
        remainingBalance = 0
        mortgageOriginal = 0
      }
    }

    // 8) livingExpense는 "다음 나이"에서 스냅샷 계산이 자연스럽도록, 올해 소득변화에 맞춰 1번만 갱신
    if (ageYear < retireAge) {
      livingExpense = snap.livingExpense
    }

    // 9) 다음 해 연봉으로 갱신(나이 +1 시점에 적용될 연봉)
    if (ageYear < retireAge) {
      annualIncome = nextAnnualIncomeDeterministic(annualIncome, {
        baseMonthlyMean: 400,
        monthlySigma: 150,
        gMin: 0.02,
      })
    } else {
      annualIncome = 0
    }
  }

  // ===== 0) currentAge가 startAge보다 작으면 방어 =====
  const targetAge = Math.max(currentAge, startAge)

  // ===== 1) startAge ~ (currentAge-1) 까지 1년치 누적 =====
  // 즉, "currentAge가 된 시점"의 순자산은 이전 나이 1년을 살면서 벌고/쓰고/저축한 결과
  for (let ageYear = startAge; ageYear < targetAge; ageYear++) {
    simulateOneYear(ageYear)
  }

  // ===== 2) currentAge 시점 월 스냅샷(누적은 안 함) =====
  const snapNow = computeMonthlySnapshot(targetAge)
  estimatedAnnualSaving = snapNow.monthlySaving * 12
  // ===== 3) 부동산 지분 =====
  const realEstateEquity = Math.max(
    0,
    (houseOwned ? housePrice : 0) - remainingBalance
  )

  // ===== 4) 주거 보증금 =====
  const yearsFromStart = currentAge - startAge

  // 🔵 전세 거주일 때만 보증금 증액 로직 적용
  const isBeforePurchase =
    !(plan.housingFuture === "buy" && loanStartAge !== null && currentAge >= loanStartAge)

  if (plan.housingBase === 'jeonse' && isBeforePurchase) {
    const updatedDeposit = applyJeonseStepIncrease(
      baselineHousingDeposit,
      yearsFromStart
    )

    const delta = updatedDeposit - currentHousingDeposit

    if (delta > 0) {
      const available = depositTotal + etfTotal

      if (available >= delta) {
        const depositRatio =
          available > 0 ? depositTotal / available : 0

        depositTotal -= delta * depositRatio
        etfTotal     -= delta * (1 - depositRatio)
      } else {
        consumerDebt += (delta - available)
        depositTotal = 0
        etfTotal = 0
      }
    }

    currentHousingDeposit = updatedDeposit
  }


  // ===== 5) 절대 자산 =====
  const grossAssetsAbs =
    depositTotal +
    etfTotal +
    realEstateEquity +
    currentHousingDeposit

  const netWorthAbs =
    grossAssetsAbs -
    consumerDebt

  // ===== 6) 상대값(기준 대비 변화량) =====
  const grossAssets = grossAssetsAbs - baselineGrossAssets
  const netWorth = netWorthAbs - baselineNetWorth

  // 증가율/증가액은 “이 나이의 연봉 vs 직전 나이의 연봉”인데
  // 여기서는 간단히: currentAge 연봉과, (currentAge-1)연봉을 재계산해서 비교
  let prevAnnualIncome = baseIncome
  {
    let tmp = baseIncome
    for (let a = startAge; a < targetAge; a++) {
      tmp = nextAnnualIncomeDeterministic(tmp, {
        baseMonthlyMean: 400,
        monthlySigma: 150,
        gMin: 0.02,
      })
    }
    // tmp는 currentAge 연봉(annualIncome 상태값과 같음)
    // prev는 currentAge-1 연봉
    let prev = baseIncome
    for (let a = startAge; a < targetAge - 1; a++) {
      prev = nextAnnualIncomeDeterministic(prev, {
        baseMonthlyMean: 400,
        monthlySigma: 150,
        gMin: 0.02,
      })
    }
    prevAnnualIncome = targetAge === startAge ? baseIncome : prev
  }

  const increaseAmount = snapNow.ai - prevAnnualIncome
  const increaseRate =
    prevAnnualIncome > 0
      ? Math.round((increaseAmount / prevAnnualIncome) * 10000) / 100
      : 0

  // 스트레스 지표는 정의가 애매해서 기존 형태 유지하되 “현재 시점” 관점으로 단순 계산
  const stressFromSaving =
    snapNow.monthlyNet > 0 ? 1 - snapNow.monthlySaving / snapNow.monthlyNet : 0

  // 성장 스트레스(직전 순자산 대비)도 “상대 순자산” 기반으로 단순 처리
  // (원하면 여기만 따로 더 정교하게 재정의 가능)
  const prevNetWorthRel = (() => {
    if (targetAge === startAge) return 0
    // currentAge-1 시점의 누적 결과를 얻기 위해 한 해 덜 누적한 상태를 복구하기 어렵기 때문에
    // 여기서는 0 처리(표현용). 필요하면 year별 상태를 저장하도록 바꾸는게 정석.
    return 0
  })()
  const stressFromGrowth =
    prevNetWorthRel > 0 ? 1 - (netWorth - prevNetWorthRel) / prevNetWorthRel : 0

  // 은퇴 후: 월저축 의미가 거의 없으니 기존처럼 1로 처리
  const stressSavingFinal = targetAge >= retireAge ? 1 : stressFromSaving

  // 은퇴 후 자산표시: 퇴직연금 포함해서 “총자산”에 반영
  const grossAssetsWithRp = targetAge >= retireAge ? (grossAssetsAbs + totalRp - baselineGrossAssets) : grossAssets

  // === UI 노출용: 현재 나이 기준 월 저축 분배 ===
  const uiDepositSaving =
    snapNow.monthlySaving * ratioMap[type].deposit

  const uiEtfSaving =
    snapNow.monthlySaving * ratioMap[type].etf

  return {
    age: targetAge,
    stressFromSaving: Math.round(stressSavingFinal),
    stressFromGrowth: Math.round(stressFromGrowth),

    salary: {
      annualIncome: Math.round(snapNow.ai),
      increaseRate,
      increaseAmount: Math.round(increaseAmount),
      rp: Math.round(snapNow.ai / 12),
    },

    monthly: {
      gross: Math.round(snapNow.ai / 12),
      net: Math.round(snapNow.monthlyNet),
      tax: Math.round((snapNow.ai / 12) - snapNow.monthlyNet),
    },

    expense: {
      total: Math.round(snapNow.totalExpense),
      rent: Math.round(snapNow.rentExpense),
      child: Math.round(snapNow.childExpense),
      marriage: Math.round(snapNow.marriageExpense),
      living: Math.round(livingExpense),
      loanInterest: Math.round(snapNow.loanInterest),
      loanPrincipal: Math.round(snapNow.loanPrincipal),
    },

    saving: {
      total: Math.round(snapNow.monthlySaving),
      deposit: Math.round(uiDepositSaving),
      etf: Math.round(uiEtfSaving),
      annual: Math.round(estimatedAnnualSaving),
    },

    accumulated: {
      total: Math.round(netWorth),
      deposit: Math.round(depositTotal),
      etf: Math.round(etfTotal),
      realEstate: Math.round(realEstateEquity),
      grossAssets: Math.round(grossAssetsWithRp),
      totalRp: Math.round(totalRp),
      purchaseHousePrice: Math.round(purchaseHousePrice),
      housingDeposit: Math.round(currentHousingDeposit),
      grossAssetsAbs: Math.round(grossAssetsAbs),   // 절대 자산
      netWorthAbs: Math.round(netWorthAbs),
      grossAssetsDelta: Math.round(grossAssetsAbs - baselineGrossAssets), // 증가분
      netWorthDelta: Math.round(netWorthAbs - baselineNetWorth),
    },

    liability: {
      mortgage: {
        loanAmount: Math.round(mortgageOriginal),
        loanRate: Math.round(loanRate * 10000) / 100,
        remainingLoan: Math.round(snapNow.remainingLoan),
      },
      consumerDebt: Math.round(consumerDebt),
      total: Math.round(snapNow.remainingLoan + consumerDebt),
    },
  }
}



export function getNetIncomeRatio(income: number): number {

  if (income <= 3000) return 0.89

  if (income <= 6000) {
    return 0.89 + (income - 3000) * (-0.00002)
  }

  if (income <= 9000) {
    return 0.83 + (income - 6000) * (-0.00002)
  }

  if (income <= 12000) {
    return 0.77 + (income - 9000) * (-0.00001)
  }

  return 0.74
}
