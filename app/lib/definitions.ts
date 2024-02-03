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