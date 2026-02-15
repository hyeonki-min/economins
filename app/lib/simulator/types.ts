export interface FinanceCardData {
  age: number
  stressFromSaving: number
  stressFromGrowth: number
  salary: {
    annualIncome: number
    increaseRate: number
    increaseAmount: number
    rp: number
  }

  monthly: {
    gross: number
    net: number
    tax: number
  }

  expense: {
    total: number
    living: number
    rent: number
    child: number
    marriage: number
    loanInterest: number
    loanPrincipal: number
  }

  saving: {
    total: number
    deposit: number
    etf: number
    annual: number
  }

  accumulated: {
    total: number
    deposit: number
    etf: number,
    realEstate: number
    grossAssets: number
    totalRp: number
    purchaseHousePrice: number
    housingDeposit: number
    grossAssetsAbs: number
    netWorthAbs: number

    grossAssetsDelta: number
    netWorthDelta: number
  }

  liability: {
    mortgage: {
      loanAmount: number
      loanRate: number
      remainingLoan: number
    },
    consumerDebt: number
    total: number
  }
}

export interface LifeEvent {
  type: 'marriage' | 'childbirth' | 'homePurchase' | 'academyFee'
  age: number
  cost?: number
  monthlyExpenseIncrease?: number
  durationYears?: number
}

export type InitialAssetType = 'none' | 'cash'

export type InitialAsset = {
  type: InitialAssetType

  // type === 'cash'
  amount: number | null        // 만원 단위, 투자 가능 자산

  // type === 'house'
  houseValue: number | null    // 자가 주택 시세

  // type === 'jeonse' | 'monthly'
  deposit: number | null       // 전·월세 보증금 (투자 불가 자산)
}

export type LifePlanState = {
  age: number
  retirementAge: number
  salary: number
  consumptionRate: number
  marriageAge: number
  children: number
  housingBase: HousingBaseType
  housingFuture: HousingFuturePlan
  housingPurchaseAge: number | null   
  investment: InvestmentStyle
  initialAsset: InitialAsset
  monthlyRent?: number | null
}

export type InvestmentStyle =
  | "aggressive"
  | "active"
  | "neutral"
  | "stable_plus"
  | "stable"

export type WageGrowthParams = {
  baseMonthlyMean?: number   // 400
  monthlySigma?: number      // 150 (곡선 완만함)
  gMin?: number              // 고소득 최소 상승률 (예: 0.02)
  gMax?: number              // 저소득 최대 상승률 (자동 계산 가능)
}

export type HousingBaseType =
  | "own"        // 이미 자가 보유
  | "family"     // 부모님 집 거주
  | "jeonse"       // 전월세 거주
  | "monthly"

export type HousingFuturePlan =
  | "no_purchase"
  | "buy"        // 구매
  | "jeonse"       // 계속 전월세
  | "monthly"
  | "custom"     // 직접 입력 (edit)
