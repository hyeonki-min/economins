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
