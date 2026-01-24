import type { Events } from "@/app/lib/definitions";

export type DerivedRange = {
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
};

/**
 * event 기준으로 차트 표시 기간을 계산한다.
 * - 기본 정책: event 기준 ±2년
 * - 미래 날짜는 현재(now)를 초과하지 않음
 */
export function deriveRangeFromEvent(
  event: Events | undefined,
  now: Date,
): DerivedRange | null {
  if (!event) {
    return null;
  }

  const [yearStr, monthStr] = event.date.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const startYear = year - 2;
  const startMonth = month;

  let endYear = year + 2;
  let endMonth = month;

  // 미래 방지
  if (
    endYear > currentYear ||
    (endYear === currentYear && endMonth > currentMonth)
  ) {
    endYear = currentYear;
    endMonth = currentMonth;
  }

  return {
    startYear,
    startMonth,
    endYear,
    endMonth,
  };
}
