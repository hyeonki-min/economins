"use client";
import React, { useEffect, useMemo, useState } from "react";
import SummaryButton from "@/app/ui/simulator/summary-button";
import { ActiveKey, InstallmentRow } from "@/app/lib/definitions";
import { DateInput, GhostButton, Input, ToggleButton } from "@/app/ui/mid-loan/component";
import { buildRowsEqual, buildRowsEvenlyByDate, computeInstallments, scalePrincipalKeepRatio } from "@/app/lib/calculator/mid-loan";
import { clamp, formatWon, parseYmd, toYmd, uid } from "@/app/lib/utils";

type Mode = "simple" | "advanced";

export default function MidLoanCalculator() {
  // Inputs
  const [salePrice, setSalePrice] = useState(600_000_000);
  const [contractRate, setContractRate] = useState(10);
  const [middleRate, setMiddleRate] = useState(60);
  const [installmentCount, setInstallmentCount] = useState(6);
  const [annualRate, setAnnualRate] = useState(4.0);
  const [startYmd, setStartYmd] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });

  const [endYmd, setEndYmd] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 3);
    return d.toISOString().slice(0, 10);
  });

  // UI
  const [mode, setMode] = useState<Mode>("simple");
  const [active, setActive] = useState<ActiveKey>(null);

  // Advanced rows state
  const middlePrincipal = useMemo(() => salePrice * (middleRate / 100), [salePrice, middleRate]);

  const [rows, setRows] = useState<InstallmentRow[]>(
    () => buildRowsEqual(6, salePrice * 0.6, startYmd, "pattern6") // 초기값: 6회차 템플릿
  );

  useEffect(() => {
    setRows(
      buildRowsEqual(
        installmentCount,
        salePrice * (middleRate / 100),
        startYmd,
        installmentCount === 6 ? "pattern6" : "every2months"
      )
    );
  }, [salePrice, middleRate, installmentCount, startYmd]);

  // Keep rows in sync when installmentCount changes
  // UX: 회차 수 바뀌면 rows도 자동 증감 + 금액 합계 맞춤(비율 유지 스케일링)
  const syncRowsCount = (nextCount: number) => {
    setRows((prev) => {
      const cur = [...prev].sort((a, b) => a.round - b.round);
      if (nextCount === cur.length) return cur;

      if (nextCount < 1) nextCount = 1;
      if (nextCount > 20) nextCount = 20;

      let next: InstallmentRow[];
      if (nextCount < cur.length) {
        next = cur.slice(0, nextCount).map((r, idx) => ({ ...r, round: idx + 1 }));
      } else {
        // add rows - by default extend schedule by 2 months from last valid date
        const last = cur[cur.length - 1];
        const lastDate = parseYmd(last?.execYmd) ?? (parseYmd(startYmd) ?? new Date());
        next = cur.map((r, idx) => ({ ...r, round: idx + 1 }));
        for (let i = cur.length; i < nextCount; i++) {
          const d = new Date(lastDate);
          d.setMonth(d.getMonth() + (i - (cur.length - 1)) * 2);
          next.push({
            id: uid(),
            round: i + 1,
            execYmd: toYmd(d),
            principal: 0,
          });
        }
      }
      // 금액 합계: 기존 비율 유지 스케일링
      return scalePrincipalKeepRatio(next, middlePrincipal);
    });
  };

  // When key financial inputs change, keep principals consistent in advanced mode
  // UX: 중도금 원금이 바뀌면 "비율 유지 스케일링"으로 자동 보정
  React.useEffect(() => {
    if (mode !== "advanced") return;
    setRows((prev) => scalePrincipalKeepRatio(prev, middlePrincipal));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [middlePrincipal, mode]);

  // Also keep row count aligned with installmentCount in advanced mode
  React.useEffect(() => {
    if (mode !== "advanced") return;
    syncRowsCount(installmentCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [installmentCount, mode]);

  // Computation
  const contract = useMemo(() => salePrice * (contractRate / 100), [salePrice, contractRate]);
  const balance = useMemo(() => salePrice - contract - middlePrincipal, [salePrice, contract, middlePrincipal]);

  const interestPack = useMemo(() => {
    if (mode === "advanced") {
      return computeInstallments({ rows, endYmd, annualRate });
    }

    // simple mode: equal splits, schedule default = pattern6 if 6회차 else 2개월 간격
    const schedule = installmentCount === 6 ? "pattern6" : "every2months";
    const simpleRows = buildRowsEqual(installmentCount, middlePrincipal, startYmd, schedule);
    return computeInstallments({ rows: simpleRows, endYmd, annualRate });
  }, [mode, rows, endYmd, annualRate, installmentCount, middlePrincipal, startYmd]);

  const totalInterest = interestPack.totalInterest;
  const totalCost = salePrice + totalInterest;
  const totalBorrowed =
    mode === "advanced"
      ? rows.reduce((a, r) => a + r.principal, 0)
      : middlePrincipal;

  const requiredAtClosing =
    totalBorrowed + balance + totalInterest;
  const principalSum = useMemo(
    () => (mode === "advanced" ? rows.reduce((a, r) => a + (Number.isFinite(r.principal) ? r.principal : 0), 0) : middlePrincipal),
    [mode, rows, middlePrincipal]
  );

  const principalDelta = Math.round(middlePrincipal - principalSum);

  // Actions
  const applyPattern6 = () => {
    setRows(buildRowsEqual(6, middlePrincipal, startYmd, "pattern6"));
    setInstallmentCount(6);
  };

  const applyEvenlySplit  = () => {
    const next = buildRowsEvenlyByDate(
        installmentCount,
        middlePrincipal,
        startYmd,
        endYmd
      );

    setRows(next);
  };
  function estimateStampDuty(loan: number) {
    if (loan <= 50_000_000) return 0
    if (loan <= 100_000_000) return 35_000
    if (loan <= 1_000_000_000) return 75_000
    return 175_000
  }

  function estimateGuaranteeFee(loan: number) {
    const min = loan * 0.002
    const max = loan * 0.005
    return { min, max }
  }
  const stampDuty = estimateStampDuty(middlePrincipal)
  const guarantee = estimateGuaranteeFee(middlePrincipal)
  return (
    <main className="max-w-6xl mx-auto px-4 py-14 space-y-12">

      <header className="space-y-3">
        <h1 className="text-3xl font-bold">
          중도금 대출 이자 계산기
        </h1>

        <div className="flex flex-wrap gap-2">
          <ToggleButton
            active={mode === "simple"}
            onClick={() => setMode("simple")}
          >
            간단모드
          </ToggleButton>

          <ToggleButton
            active={mode === "advanced"}
            onClick={() => setMode("advanced")}
          >
            고급모드(회차별 실행일/금액 편집)
          </ToggleButton>
        </div>

        <div className="text-sm text-gray-500">
          이자 계산식:
          <span className="font-medium">
            대출금 × 연이율 × (대출일수 / 365)
          </span>
        </div>
      </header>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">

        {/* ===== 왼쪽: 결과 카드 ===== */}
        <section
          className="
            bg-white
            border border-slate-200
            rounded-3xl
            p-6
            space-y-5
            shadow-sm
          "
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800 tracking-tight">
              자금 요약
            </h2>
            <span className="text-xs text-slate-400">
              입주 시점 기준
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                <SummaryButton
                    label="총 분양가"
                    value={salePrice}
                    unit="원"
                    isActive={active === 'salary'}
                    onClick={() => setActive(active === 'salary' ? null : 'salary')}
                    color="blue"
                />

                <SummaryButton
                    label="중도금 누적 이자"
                    value={Math.round(totalInterest)}
                    unit="원"
                    isActive={active === 'netMonthlyIncome'}
                    onClick={() => setActive(active === 'netMonthlyIncome' ? null : 'netMonthlyIncome')}
                    color="green"
                />

                <SummaryButton
                    label="입주 시 총 정산 금액"
                    value={Math.round(requiredAtClosing)}
                    unit="원"
                    isActive={active === 'expense'}
                    onClick={() => setActive(active === 'expense' ? null : 'expense')}
                    color="rose"
                />
            
                <SummaryButton
                    label="최종 총 실지출"
                    value={Math.round(totalCost)}
                    unit="원"
                    isActive={active === 'saving'}
                    onClick={() => setActive(active === 'saving' ? null : 'saving')}
                    color="red"
                />
            </div>
            <div
            className={`
                overflow-hidden transition-all duration-300
                ${active ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
            `}
            >
            {active && (
                <div className="mt-4 p-4 rounded-xl bg-gray-50 space-y-2">
                {active === 'salary' && (
                    <>
                    <div className="border-b border-slate-100">
                    <p className="font-semibold text-blue-700">
                        상세 분양가
                    </p>
                    </div>
    
                    <div className="px-4 py-3 space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                        <span className="text-slate-500">계약금</span>
                        </div>
                        <span className="font-semibold text-slate-800 tabular-nums">
                        {formatWon(contract)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">중도금</span>
                        <span className="font-semibold tabular-nums">
                        {formatWon(middlePrincipal)}
                        </span>
                    </div>
    
                    <div className="flex justify-between">
                        <span className="text-slate-500">잔금</span>
                        <span className="font-semibold tabular-nums">
                        {formatWon(balance)}
                        </span>
                    </div>
                    </div>
                    </>
                )}
            
                {active === 'netMonthlyIncome' && (
                <>
                    <div className="border-b border-slate-100">
                        <p className="font-semibold text-indigo-700">
                        중도금 누적 이자
                        </p>
                        <span className="text-xs text-slate-400">
                        분양가 대비 {((totalInterest / salePrice) * 100).toFixed(1)}%
                        </span>
                    </div>

                    <div className="px-2 py-2 space-y-2 text-sm">
                        <div className="bg-white border rounded-xl p-4 space-y-2">
                        {interestPack.computed.map((r) => (
                            <div key={r.id} className="flex justify-between text-sm">
                            <span>
                                {r.round}차 · {r.execYmd} · {r.days}일
                            </span>
                            <span className="font-medium tabular-nums">
                                {formatWon(r.interest)}
                            </span>
                            </div>
                        ))}
                        <hr className="my-2" />
                        <div className="flex justify-between font-semibold tabular-nums">
                            <span>합계</span>
                            <span>{formatWon(totalInterest)}</span>
                        </div>
                        </div>
                        <span>
                          ⚠️ 중도금 이자만으로 중형차 한 대 값이 나올 수 있습니다.
                        </span>
                    </div>
                    
                </>                
                )}

                {active === 'expense' && (
                    <>
                    <div className="border-b border-slate-100">
                        <p className="font-semibold text-indigo-700">
                        입주일에 실제로 준비해야 할 금액
                        </p>
                    </div>

                    <div className="px-4 py-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">중도금 대출 원금</span>
                            <span className="font-semibold text-slate-800 tabular-nums">
                            {formatWon(middlePrincipal)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">중도금 대출 이자</span>
                            <span className="font-semibold text-slate-800 tabular-nums">
                            {formatWon(totalInterest)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">잔금</span>
                            <span className="font-semibold text-slate-800 tabular-nums">
                            {formatWon(balance)}
                            </span>
                        </div>
                    </div>
                    </>
                )}

                {active === 'saving' && (
                    <>
                    <div className="border-b border-slate-100">
                        <p className="font-semibold text-indigo-700">
                        최종 총 실지출
                        </p>
                    </div>

                    <div className="px-4 py-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                        <span className="text-slate-500">분양가</span>
                        <span className="font-semibold text-slate-800 tabular-nums">
                            {formatWon(salePrice)}
                        </span>
                        </div>

                        <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                            <span className="text-slate-500">중도금 이자</span>
                        </div>
                        <span className="font-semibold tabular-nums">
                            {formatWon(totalInterest)}
                        </span>
                        </div>
                                                
                        <div className="flex justify-between">
                        <span className="text-slate-500">합계</span>
                        <span className="font-semibold text-slate-800 tabular-nums">
                            {formatWon(totalCost)}
                        </span>
                        </div>
                        <div className="border-b border-slate-200">
                        </div>
                        <div className="flex justify-between">
                        <span className="text-slate-500">인지대</span>
                        <span className="font-semibold text-slate-800 tabular-nums">
                            {formatWon(stampDuty)}
                        </span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-slate-500">보증보험료(예상)</span>
                        <span className="font-semibold text-slate-800 tabular-nums">
                            {guarantee.min + "원 - "+ guarantee.max + "원"}
                        </span>
                        </div>
                    </div>
                    </>
                )}
                </div>
            )}
            </div>
      </section>
      {/* 입력 */}
      <section className="space-y-6">
        <Input label="분양가 (원)" value={salePrice} onChange={setSalePrice} min={0} step={1000000} />
        <Input label="계약금 비율 (%)" value={contractRate} onChange={setContractRate} min={0} max={100} step={0.1} />
        <Input label="중도금 비율 (%)" value={middleRate} onChange={setMiddleRate} min={0} max={100} step={0.1} />
        <Input label="연이율 (%)" value={annualRate} onChange={setAnnualRate} min={0} max={30} step={0.01} />

        <Input
          label="중도금 회차 수"
          value={installmentCount}
          onChange={(v) => {
            const next = clamp(Math.round(v), 1, 20);
            setInstallmentCount(next);
            if (mode === "advanced") syncRowsCount(next);
          }}
          min={1}
          max={20}
          step={1}
        />
        <DateInput label="1차 실행일" value={startYmd} onChange={setStartYmd} />
        <DateInput label="입주일" value={endYmd} onChange={setEndYmd} />

      </section>
      </div>
      <section>
        {/* 고급모드 편집기 */}
        {mode === "advanced" && (
          <div className="border rounded-2xl p-5 bg-white shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="font-semibold">회차별 실행 스케줄</div>
                <div className="text-sm text-gray-500">
                  실행일과 실행금액을 직접 수정합니다. (합계는 중도금 원금 {formatWon(middlePrincipal)} 기준)
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <GhostButton onClick={applyPattern6}>6회차 템플릿 적용</GhostButton>
                <GhostButton onClick={applyEvenlySplit}>균등 분할 적용</GhostButton>
              </div>
            </div>

            {/* 합계/오차 표시 */}
            <div className="text-sm">
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-gray-600">
                <span>현재 합계: <span className="font-medium text-gray-900">{formatWon(principalSum)}</span></span>
                <span>
                  차이:{" "}
                  <span className={`font-medium ${principalDelta === 0 ? "text-emerald-700" : "text-rose-700"}`}>
                    {principalDelta === 0 ? "0원 (정상)" : `${principalDelta > 0 ? "+" : ""}${principalDelta.toLocaleString("ko-KR")}원`}
                  </span>
                </span>
              </div>
              {principalDelta !== 0 && (
                <div className="mt-1 text-xs text-amber-600">
                  합계가 중도금 원금과 다릅니다. “균등 분할 맞추기” 또는 “비율 유지 스케일링”을 눌러 자동 보정하세요.
                </div>
              )}
            </div>

            {/* 편집 테이블 (내부 스크롤 없이 그냥 리스트로) */}
            <div className="space-y-3">
              {rows
                .slice()
                .sort((a, b) => a.round - b.round)
                .map((r) => {
                  const computed = interestPack.computed.find((x) => x.id === r.id);
                  return (
                    <div key={r.id} className="border rounded-xl p-4">
                      <div className="flex flex-wrap items-end gap-3">
                        <div className="w-14">
                          <div className="text-xs text-gray-500">회차</div>
                          <div className="font-semibold">{r.round}차</div>
                        </div>

                        <div className="min-w-[180px] flex-1">
                          <label className="block text-xs text-gray-500 mb-1">실행일</label>
                          <input
                            type="date"
                            value={r.execYmd}
                            onChange={(e) =>
                              setRows((prev) =>
                                prev.map((x) => (x.id === r.id ? { ...x, execYmd: e.target.value } : x))
                              )
                            }
                            className="w-full border rounded-lg px-3 py-2"
                          />
                        </div>

                        <div className="min-w-[200px] flex-1">
                          <label className="block text-xs text-gray-500 mb-1">실행금액 (원)</label>
                          <input
                            type="number"
                            value={r.principal}
                            onChange={(e) =>
                              setRows((prev) =>
                                prev.map((x) =>
                                  x.id === r.id ? { ...x, principal: Math.max(0, Number(e.target.value)) } : x
                                )
                              )
                            }
                            className="w-full border rounded-lg px-3 py-2"
                          />
                        </div>

                        <div className="min-w-[120px]">
                          <div className="text-xs text-gray-500">대출일수</div>
                          <div className="font-medium">{computed ? `${computed.days}일` : "-"}</div>
                        </div>

                        <div className="min-w-[160px]">
                          <div className="text-xs text-gray-500">회차 이자</div>
                          <div className="font-semibold tabular-nums">{computed ? formatWon(computed.interest) : "-"}</div>
                        </div>

                        <div className="ml-auto">
                          <button
                            type="button"
                            className="text-sm text-rose-600 hover:text-rose-700"
                            onClick={() => {
                              setRows((prev) => {
                                if (prev.length <= 1) return prev;
                                const next = prev.filter((x) => x.id !== r.id).map((x, idx) => ({ ...x, round: idx + 1 }));
                                setInstallmentCount(next.length);
                                return next;
                              });
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      {computed && computed.warnings.length > 0 && (
                        <div className="mt-2 text-xs text-amber-600">
                          {computed.warnings.join(" / ")}
                        </div>
                      )}
                    </div>
                  );
                })}

              <div>
                <button
                  type="button"
                  className="w-full border rounded-xl py-3 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setRows((prev) => {
                      const last = prev.slice().sort((a, b) => a.round - b.round)[prev.length - 1];
                      const lastDate = parseYmd(last?.execYmd) ?? (parseYmd(startYmd) ?? new Date());
                      const d = new Date(lastDate);
                      d.setMonth(d.getMonth() + 2);

                      const next = [
                        ...prev,
                        { id: uid(), round: prev.length + 1, execYmd: toYmd(d), principal: 0 },
                      ];
                      setInstallmentCount(next.length);
                      return next;
                    });
                  }}
                >
                  + 회차 추가
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
      <div className="text-sm text-gray-500 leading-relaxed">
        ※ 실제 은행/사업장 조건(이자 계산 기준일, 윤년 366일 적용, 실행일/정산일 규정)에 따라 결과가 달라질 수 있습니다.
      </div>
    </main>
  );
}