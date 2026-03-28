// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type Revenue = {
  month: string;
  revenue: number;
};

export type Indicator = {
  name: string;
  type: string;
  source: string;
  id: string;
  initDate: string;
  unit: string;
}

export type Report = {
  title: string;
  description: string;
  source: string;
  sourceUrl: string;
}

export type IndicatorInfo = {
  keyword: string;
  description: string;
}

export type SearchParams = {
  event?: string;
  start?: string;
  end?: string;
};

export type RouteParams = {
  id: string;
  compareId: string;
};

export type RouteProps<
  P = RouteParams,
  Q = SearchParams
> = {
  params: Promise<Readonly<P>>;
  searchParams: Promise<Readonly<Q>>;
};

export type EventMeta = {
  id: string;
  name: string;
  date: string;
};

export type Events = {
  id: string;
  name: string;
  description: string;
  date: string;
  url: string;
};

export type DateRange = {
  start: string;
  end: string;
}

export type XYPoint = {
  x: string;
  y: string | number;
}

export type XYPointList = XYPoint[];

export type MonetaryPolicyBrief = {
  title?: string;
  summary?: string[];
  tooltip?: Record<string, string>; 
}

export type PickerTarget = "start" | "end" | null;

export type CarouselProps = {
  seriesA?: XYPoint[] | null;
  seriesB?: XYPoint[] | null;
  indicatorA?: Indicator;
  indicatorB?: Indicator;
  event?: EventMeta;
};

export type ActiveKey =
  | 'salary'
  | 'netMonthlyIncome'
  | 'expense'
  | 'saving'
  | 'asset'
  | 'liability'
  | null;

export type InstallmentRow = {
  id: string;
  round: number;
  execYmd: string; // YYYY-MM-DD
  principal: number; // 실행금액(원)
};

export type InstallmentComputed = InstallmentRow & {
  days: number;
  interest: number;
  warnings: string[];
};

export type FuelType = "gasoline" | "diesel";

export type VehicleType =
  | "compact"
  | "compactSedan"
  | "midsize"
  | "large"
  | "truck5t";

export interface VehiclePreset {
  label: string;
  tank: number;
  efficiency: number;
  icon: string;
}

export interface FullTankResult {
  needed: number;
  cost: number;
}

export interface PriceImpactResult {
  newPrice: number;
  diff: number;
}

export interface TravelWorthResult {
  saving: number;
  fuelCost: number;
  worth: boolean;
}

export type InsuranceInput = {
  monthlyPremium: number

  paymentYears: number
  elapsedYears: number

  currentAge: number
  maturityAge: number

  expectedClaimAge: number // 🔥 추가

  coverageAmount: number
  inflationRate: number

  expectedReturnRate: number // 🔥 투자 수익률
  surrenderValue?: number    // 선택
}

export type InsuranceCompareResult = {
  paidSoFarNominal: number
  remainingNominal: number
  totalNominal: number
  
  yearsToClaim: number

  coverageFutureValue: number
  coveragePresentValue: number

  investmentFutureValue: number
  investmentPresentValue: number

  differencePV: number
  ratio: number
}

export type NumberInputProps = {
  value: number
  onChange: (v: number) => void
  suffix?: string
  min?: number
  max?: number
  decimalScale?: number
}

export type AgeInputProps = Omit<NumberInputProps, "suffix"> & {
  minAge: number
  maxAge: number
}

export type DurationInputProps = Omit<NumberInputProps, "suffix">

export type PercentInputProps = Omit<NumberInputProps, "suffix">

export type IssueLevel = "LOW" | "MEDIUM" | "HIGH"

export type IssueStatus = "BUY" | "NEUTRAL" | "WAIT"

export type MarketIssueType =
  | "QUAD_WITCHING"
  | "OPTIONS_EXPIRY"
  | "MONTH_END"
  | "QUARTER_END"
  | "YEAR_END"
  | "KOREA_EXPIRY"

export type IssueCategory = "STRUCTURAL" | "MACRO"

export type MarketIssue = {
  type: string
  name: string
  level: IssueLevel
  date: string
  summary: string
  market: "KR" | "US"
  category: IssueCategory
}