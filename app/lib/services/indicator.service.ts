import { IndicatorSectionData } from "@/app/lib/domain/indicator.types";
import { STATIC_INDICATOR_SECTIONS } from "@/app/lib/data/indicator.static";

/**
 * 🔑 app / ui는 이 함수만 사용
 */
export async function loadIndicatorSections(): Promise<IndicatorSectionData[]> {
  return STATIC_INDICATOR_SECTIONS;
}
