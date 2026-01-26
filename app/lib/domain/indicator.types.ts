import { IndicatorKey } from "./indicator.keys";

export interface IndicatorItem {
  key: IndicatorKey;
  label: string;
  hint: string;
}

export interface IndicatorCardData {
  id: string;
  title: string;
  description: string;
  href: string;
  indicators: IndicatorItem[];
}

export interface IndicatorSectionData {
  id: string;
  title: string;
  description?: string;
  cards: IndicatorCardData[];
}
