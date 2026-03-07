import { InstallmentComputed, InstallmentRow } from "@/app/lib/definitions";
import { addDays, dayDiff, parseYmd, toYmd, uid } from "@/app/lib/utils";

/**
 * 6회차 패턴 (1차 기준 오프셋)
 * 1: 2026-05-12
 * 2: 2026-11-10  (+182)
 * 3: 2027-06-08  (+392)
 * 4: 2028-01-11  (+609)
 * 5: 2028-06-13  (+763)
 * 6: 2028-11-07  (+910)
 */
const OFFSETS_6 = [0, 182, 392, 609, 763, 910] as const;

export function buildRowsEqual(
  installmentCount: number,
  middlePrincipal: number,
  startYmd: string,
  schedule: "every2months" | "pattern6"
): InstallmentRow[] {
  const first = parseYmd(startYmd) ?? new Date();
  const baseAmount = middlePrincipal / installmentCount;

  const rows: InstallmentRow[] = [];
  for (let i = 0; i < installmentCount; i++) {
    let execDate: Date;
    if (schedule === "pattern6" && installmentCount === 6) {
      execDate = addDays(first, OFFSETS_6[i] ?? 0);
    } else {
      // fallback: 2개월 간격
      execDate = new Date(first);
      execDate.setMonth(execDate.getMonth() + i * 2);
    }

    rows.push({
      id: uid(),
      round: i + 1,
      execYmd: toYmd(execDate),
      principal: Math.round(baseAmount),
    });
  }
  return normalizePrincipalSum(rows, middlePrincipal);
}

export function buildRowsEvenlyByDate(
  count: number,
  middlePrincipal: number,
  startYmd: string,
  endYmd: string
): InstallmentRow[] {
  const start = parseYmd(startYmd);
  const end = parseYmd(endYmd);

  if (!start || !end || count <= 0) return [];

  const totalMs = end.getTime() - start.getTime();
  const stepMs = totalMs / count;

  const equalPrincipal = Math.floor(middlePrincipal / count);
  const remainder = middlePrincipal - equalPrincipal * count;

  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start.getTime() + stepMs * i);

    return {
      id: uid(),
      round: i + 1,
      execYmd: toYmd(d),
      principal:
        i === count - 1
          ? equalPrincipal + remainder
          : equalPrincipal,
    };
  });
}

export function normalizePrincipalSum(rows: InstallmentRow[], targetSum: number) {
  // 반올림 누적 오차를 마지막 행에 보정
  if (rows.length === 0) return rows;
  const sum = rows.reduce((acc, r) => acc + (Number.isFinite(r.principal) ? r.principal : 0), 0);
  const diff = Math.round(targetSum - sum);
  const last = rows[rows.length - 1];
  const fixed = rows.map((r) => ({ ...r }));
  fixed[fixed.length - 1] = { ...last, principal: Math.max(0, last.principal + diff) };
  return fixed;
}

export function scalePrincipalKeepRatio(rows: InstallmentRow[], targetSum: number) {
  const cur = rows.reduce((acc, r) => acc + (Number.isFinite(r.principal) ? r.principal : 0), 0);
  if (cur <= 0) return normalizePrincipalSum(rows.map((r) => ({ ...r, principal: 0 })), targetSum);

  const scaled = rows.map((r) => ({
    ...r,
    principal: Math.max(0, Math.round((r.principal / cur) * targetSum)),
  }));
  return normalizePrincipalSum(scaled, targetSum);
}

export function computeInstallments(params: {
  rows: InstallmentRow[];
  endYmd: string;
  annualRate: number; // %
}) {
  const end = parseYmd(params.endYmd);
  const yearlyRate = params.annualRate / 100;

  const computed: InstallmentComputed[] = params.rows.map((r) => {
    const warnings: string[] = [];
    const exec = parseYmd(r.execYmd);

    if (!exec) warnings.push("실행일이 올바르지 않습니다.");
    if (!end) warnings.push("입주일이 올바르지 않습니다.");

    let days = 0;
    if (exec && end) {
      days = dayDiff(exec, end);
      if (exec.getTime() > end.getTime()) warnings.push("입주일 이후 실행일입니다. (이자 0)");
    }

    const principal = Number.isFinite(r.principal) ? r.principal : 0;
    const interest =
      exec && end && exec.getTime() <= end.getTime()
        ? principal * yearlyRate * (days / 365)
        : 0;

    return {
      ...r,
      principal,
      days,
      interest,
      warnings,
    };
  });

  const totalInterest = computed.reduce((acc, r) => acc + r.interest, 0);
  return { computed, totalInterest };
}