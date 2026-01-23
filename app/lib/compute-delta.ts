import { XYPoint } from "./definitions";

type DeltaResult = {
  label: "+1M" | "+3M" | "+6M" | "+1Y";
  value: number | null;
};

function findExactPoint(series: XYPoint[], ym: string): XYPoint | null {
  const p = series.find(p => p?.x === ym);
  return p ?? null;
}

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

  // 항상 4칸 유지
  const empty = offsets.map(o => ({ label: o.label, value: null as number | null }));

  if (!series || !eventYm) return empty;

  // ✅ base는 eventYm에 정확히 있어야 함
  const base = findExactPoint(series, eventYm);
  if (!base || typeof base.y !== "number") return empty;

  return offsets.map(o => {
    const targetYm = addMonths(eventYm, o.m);
    if (!targetYm) return { label: o.label, value: null };

    // target은 기존처럼 “다음 관측값” 허용(분기 데이터 대응)
    const target = findNextPoint(series, targetYm);
    if (!target || typeof target.y !== "number") return { label: o.label, value: null };

    const diff = target.y - base.y;
    return { label: o.label, value: Math.round(diff * 100) / 100 };
  });
}


function addMonths(
  ym?: string | null,
  months?: number | null
): string | null {
  if (!ym || months == null) return null;

  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) return null;

  const d = new Date(y, m - 1);
  d.setMonth(d.getMonth() + months);

  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yy}-${mm}`;
}


function ymToKey(ym: string): number {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

function findNextPoint(
  series: XYPoint[],
  targetYm: string
): XYPoint | null {
  const targetKey = ymToKey(targetYm);

  const candidates = series
    .filter(p => ymToKey(p.x) >= targetKey)
    .sort((a, b) => ymToKey(a.x) - ymToKey(b.x));

  return candidates.length > 0 ? candidates[0] : null;
}

/**
 * eventYm 시점에 기준 series 데이터가 존재하는지 여부
 */
export function hasBaseSeriesAtEvent(
  series?: Point[] | null,
  eventYm?: string | null
): boolean {
  const eventKey = ymToKey(eventYm);
  if (!series || eventKey == null) return false;

  return series.some(p => {
    const key = ymToKey(p?.x);
    if (key == null) return false;
    if (p.y == null) return false;

    return key === eventKey;
  });
}
