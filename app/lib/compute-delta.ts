import { XYPoint } from "./definitions";

type DeltaResult = {
  label: "+1M" | "+3M" | "+6M" | "+1Y";
  value: number | null;
};

/* ======================
 * date helpers
 * ====================== */

function ymToKey(ym: string): number {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

function addMonths(ym: string, months: number): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1);
  d.setMonth(d.getMonth() + months);

  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yy}-${mm}`;
}

/**
 * event 이전에 발표된 분기 말 계산
 */
function getPrevQuarterEndYm(eventYm: string): string {
  const [y, m] = eventYm.split("-").map(Number);

  if (m <= 3) return `${y - 1}-12`;
  if (m <= 6) return `${y}-03`;
  if (m <= 9) return `${y}-06`;
  return `${y}-09`;
}

/* ======================
 * series helpers
 * ====================== */

function findExactPoint(series: XYPoint[], ym: string): XYPoint | null {
  return series.find(p => p?.x === ym && p?.y != null) ?? null;
}

/**
 * targetYm 이후 최초 관측값
 * (분기 / 비정기 데이터 대응)
 */
function findNextPoint(series: XYPoint[], targetYm: string): XYPoint | null {
  const targetKey = ymToKey(targetYm);

  return (
    series
      .filter(p => p?.y != null && ymToKey(p.x) >= targetKey)
      .sort((a, b) => ymToKey(a.x) - ymToKey(b.x))[0] ?? null
  );
}

function isQuarterlySeries(series: XYPoint[]): boolean {
  // 값이 있는 관측치만 사용
  const points = series
    .filter(p => p?.y != null)
    .map(p => ymToKey(p.x));

  // 유효한 관측치가 너무 적으면 판단 불가 → monthly로 취급
  if (points.length < 2) return false;

  const diffs = points.slice(1).map((k, i) => k - points[i]);
  const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;

  // 평균 간격이 3개월 이상이면 quarterly
  return avg >= 3;
}

/**
 * quarterly delta 허용 여부
 * → 다음 분기 데이터 이후부터
 */
function isQuarterDeltaAllowed(eventYm: string, offsetMonths: number): boolean {
  const baseKey = ymToKey(getPrevQuarterEndYm(eventYm));
  const targetKey = ymToKey(addMonths(eventYm, offsetMonths));
  return targetKey > baseKey;
}

/* ======================
 * main
 * ====================== */

export function computeDeltas(
  series?: XYPoint[] | null,
  eventYm?: string | null
): DeltaResult[] {
  const offsets = [
    { label: "+1M", m: 1 },
    { label: "+3M", m: 3 },
    { label: "+6M", m: 6 },
    { label: "+1Y", m: 12 },
  ] as const;

  const empty = offsets.map(o => ({
    label: o.label,
    value: null as number | null,
  }));

  if (!series || !eventYm) return empty;

  const isQuarterly = isQuarterlySeries(series);

  // ===== base 계산 =====
  const baseYm = isQuarterly
    ? getPrevQuarterEndYm(eventYm)
    : eventYm;
  const base = isQuarterly
    ? findNextPoint(series, baseYm) // event 이전 가장 최근 분기
    : findExactPoint(series, baseYm);

  if (!base) return empty;

  return offsets.map(o => {
    // quarterly: 다음 분기 이후만 허용
    if (isQuarterly && !isQuarterDeltaAllowed(eventYm, o.m)) {
      return { label: o.label, value: null };
    }

    const targetYm = addMonths(eventYm, o.m);
    const target = findNextPoint(series, targetYm);

    if (!target) {
      return { label: o.label, value: null };
    }

    const diff = Number(target.y) - Number(base.y);
    return {
      label: o.label,
      value: Math.round(diff * 100) / 100,
    };
  });
}

/**
 * event 시점 기준으로 base 데이터 존재 여부
 * (카드 표시 여부 판단용)
 */
export function hasBaseSeriesAtEvent(
  series?: XYPoint[] | null,
  eventYm?: string | null
): boolean {
  if (!series || !eventYm) return false;

  const isQuarterly = isQuarterlySeries(series);

  if (!isQuarterly) {
    // monthly: 정확 일치만 허용
    return series.some(p => p?.x === eventYm && p?.y != null);
  }

  // quarterly: event 이전 데이터 하나라도 있으면 OK
  const eventKey = ymToKey(eventYm);

  return series.some(p => {
    if (p?.y == null) return false;
    return ymToKey(p.x) <= eventKey;
  });
}
