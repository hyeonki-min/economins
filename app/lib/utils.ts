import { Revenue, Indicator } from './definitions';
import { z } from 'zod';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

// YYYY-MM 형식 정규식
const yearMonthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

// 오늘 날짜 기준 YYYY-MM
function getTodayYearMonth(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
}

// number 입력 받아 YYYY-MM 만들기
export function getStringYearMonth(year: number, month: number): string {
  const date = new Date(year, month - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}


// 주어진 YYYY-MM에서 N년 전 구하기
function getYearMonthYearsAgo(from: string, years: number): string {
  const [year, month] = from.split("-").map(Number);
  const date = new Date(year, month - 1);
  date.setFullYear(date.getFullYear() - years);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getValidDateRange(start?: string | null, end?: string | null) {
  const today = getTodayYearMonth();

  const endValid = yearMonthRegex.test(end || "") && end! <= today
    ? end!
    : today;

  const startValid = yearMonthRegex.test(start || "")
    ? start!
    : getYearMonthYearsAgo(endValid, 5);

  return { start: startValid, end: endValid };
}

export const DateRangeSchema = z
  .object({
    start: z.string().nullable().optional(),
    end: z.string().nullable().optional(),
  })
  .transform(({ start, end }) => {
    const { start: s, end: e } = getValidDateRange(start, end);
    return { start: s, end: e };
  })
  .refine(({ start, end }) => start <= end, {
    message: "시작일은 종료일보다 이전이어야 합니다.",
  });

export function getYear(date: string): number {
  const time = new Date(date);
  return time.getFullYear();
}

export function getMonth(date: string): number {
  const time = new Date(date);
  return time.getMonth() + 1;
}

export function findEvent<T extends { id: string }>(
  items: T[],
  searchValue: string | undefined
): T | undefined {
  if (!searchValue) return undefined;
  return items.find((item) => item.id === searchValue);
}

export function adjustDateRangeByEvent(
  dateRange: { start: string; end: string },
  eventDate?: string
): { start: string; end: string } {
  if (!eventDate) return dateRange;
  if (eventDate < dateRange.start || eventDate > dateRange.end) {
    return {
      start: getYearMonthYearsAgo(eventDate, 2),
      end: getYearMonthYearsAgo(eventDate, -2),
    };
  }
  return dateRange;
}

function parseYearMonth(initDate: string | Date) {
  if (initDate instanceof Date) {
    return {
      year: initDate.getFullYear(),
      month: initDate.getMonth() + 1,
    };
  }

  // "YYYY-MM"
  if (initDate.includes("-")) {
    const [y, m] = initDate.split("-");
    return { year: Number(y), month: Number(m) };
  }

  // "YYYYMM"
  return {
    year: Number(initDate.slice(0, 4)),
    month: Number(initDate.slice(4, 6)),
  };
}


export function buildYearsFromInitDate(initDate: string | Date) {
  const { year: startYear } = parseYearMonth(initDate);
  const currentYear = new Date().getFullYear();

  return Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  );
}

export function isDisabled(
  y: number,
  m: number,
  indicator: Indicator
) {
  const { year: initYear, month: initMonth } =
    parseYearMonth(indicator.initDate);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // initDate 이전은 전부 비활성
  if (y < initYear) return true;

  // 시작년도에서는 initMonth 이전 비활성
  if (y === initYear && m < initMonth) return true;

  // 현재년도에서는 현재월 이후 비활성
  if (y === currentYear && m > currentMonth) return true;

  return false;
}

