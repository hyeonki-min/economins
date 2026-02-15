'use client'

import { AgeOptionCard } from '@/app/ui/simulator/age-option-card'
import { SelectCard } from '@/app/ui/simulator/select-card'
import { NumericInputCard } from '@/app/ui/simulator/numeric-input-card'
import { Section } from '@/app/ui/simulator/section'
import { HousingBaseType, HousingFuturePlan, InitialAssetType, InvestmentStyle, LifePlanState } from '@/app/lib/simulator/types'
import { ScenarioSummaryCard } from '@/app/ui/simulator/scenario-summary-card'
import { useEffect } from 'react'


type Props = {
  plan: LifePlanState
  onChange: React.Dispatch<React.SetStateAction<LifePlanState>>
  setMobileMode: React.Dispatch<
    React.SetStateAction<"simulation" | "plan">
  >
}


export default function ScenarioPlan({ plan, onChange, setMobileMode }: Props) {
  useEffect(() => {
    if (plan.housingBase === "jeonse") {
      onChange(prev => ({
        ...prev,
        initialAsset: {
          ...prev.initialAsset,
          deposit: prev.initialAsset.deposit ?? 10000,
          houseValue: null,
        },
        monthlyRent: null,
      }))
    }

    if (plan.housingBase === "monthly") {
      onChange(prev => ({
        ...prev,
        initialAsset: {
          ...prev.initialAsset,
          deposit: prev.initialAsset.deposit ?? 1000,
          houseValue: null,
        },
        monthlyRent: prev.monthlyRent ?? 50,
      }))
    }

    if (plan.housingBase === "own") {
      onChange(prev => ({
        ...prev,
        housingFuture: "no_purchase",
        housingPurchaseAge: null,
        initialAsset: {
          ...prev.initialAsset,
          houseValue: prev.initialAsset.houseValue ?? 60000,
          deposit: null,
        },
        monthlyRent: null,
      }))
    }

    if (plan.housingBase === "family") {
      onChange(prev => ({
        ...prev,
        initialAsset: {
          ...prev.initialAsset,
          deposit: null,
          houseValue: null,
        },
        monthlyRent: null,
      }))
    }
  }, [plan.housingBase])


  useEffect(() => {
    if (plan.marriageAge !== 0) return

    onChange(prev => {
      if (prev.children === 0) return prev
      return { ...prev, children: 0 }
    })
  }, [plan.marriageAge, onChange])

  return (
    <main className="min-h-screen bg-slate-50">
      <div
        className="
          lg:hidden
          sticky top-0 z-50
          bg-white
        "
      >
        <div className="flex items-center justify-between">

          {/* 요약 영역 */}
          <div className="flex-1 text-sm text-slate-700 truncate">
            <ScenarioSummaryCard plan={plan} />
          </div>

          {/* + 버튼 */}
          <div className="ml-3">
            <button
              onClick={() => setMobileMode("simulation")}
              className="
                w-7 h-7
                flex items-center justify-center
                rounded-full
                bg-slate-900
                text-white
                leading-none
                active:scale-90
                transition
              "
            >
              +
            </button>
          </div>

        </div>
      </div>

      <div className="
        mx-auto
        w-full
        max-w-5xl
        space-y-12 sm:space-y-16
      ">        

        {/* ===================== */}
        {/* 1. 나이 */}
        {/* ===================== */}
        <Section
          title="현재 나이"
          description="시뮬레이션의 기준 시점을 설정합니다."
        >
          <AgeOptionCard
            value={plan.age}
            onChange={(age) =>
              onChange(p => ({ ...p, age }))
            }
          />
        </Section>

        {/* ===================== */}
        {/* 2. 은퇴 */}
        {/* ===================== */}
        <Section
          title="은퇴 기준"
          description="언제까지 소득이 발생한다고 가정할지 선택합니다."
        >
          <SelectCard
            title="은퇴"
            value={plan.retirementAge}
            onChange={(v) =>
              onChange(p => ({ ...p, retirementAge: v }))
            }
            options={[
              { label: "60세", value: 60, description: "정년 보장"},
              { label: "49세", value: 49, description: "평균 퇴직 연령" },
              { label: "83세", value: 83, description: "평균 사망 연령"},
            ]}
          />

        </Section>

        {/* ===================== */}
        {/* 3. 연봉 */}
        {/* ===================== */}
        <Section
          title="현재 연봉"
          description="현재 기준 연봉을 설정합니다."
        >
          <NumericInputCard
            title="연봉"
            value={plan.salary}
            unit="만원"
            presets={[
              { label: "연봉 3천", value: 3000, description: "3,000만원"},
              { label: "연봉 4천", value: 4000, description: "4,000만원" },
              { label: "연봉 5천", value: 5000, description: "5,000만원" },
              { label: "연봉 6천", value: 6000, description: "6,000만원" },
            ]}
            onChange={(salary) =>
              onChange(p => ({ ...p, salary }))
            }
          />
        </Section>

        {/* ===================== */}
        {/* 4. 소비스타일 */}
        {/* ===================== */}
        <Section
          title="소비 스타일"
          description="소득 대비 소비 성향을 선택합니다."
        >
            <SelectCard
              title="소비 스타일"
              value={plan.consumptionRate}
              onChange={(v) =>
                onChange(p => ({ ...p, consumptionRate: v }))
              }
              options={[
                { label: "절약형", value: 0.3, description: "소득의 30% 소비"},
                { label: "보통", value: 0.5, description: "소득의 50% 소비" },
                { label: "소비형", value: 0.7, description: "소득의 70% 소비"},
              ]}
            />
        </Section>

        {/* ===================== */}
        {/* 5. 결혼 계획 */}
        {/* ===================== */}
        <Section
          title="결혼 계획"
          description="결혼 시점을 가정합니다."
        >
          <NumericInputCard
            title="결혼"
            value={plan.marriageAge}
            unit="세"
            presets={[
              { label: "28세 결혼", value: 28},
              { label: "32세 결혼", value: 32},
              { label: "36세 결혼", value: 36},
              { label: "비혼", value: 0},
            ]}
            onChange={(v) =>
              onChange(p => ({ ...p, marriageAge: v }))
            }
          />
        </Section>

        {/* ===================== */}
        {/* 6. 자녀 계획 */}
        {/* ===================== */}
        <Section
          title="자녀 계획"
          description="자녀 수에 따른 지출 변화를 반영합니다. 결혼 후 2년 고정입니다."
        >
          <SelectCard
            title="자녀 계획"
            value={plan.children}
            onChange={(v) =>
              onChange(p => ({ ...p, children: v }))
            }
            options={[
              { label: "자녀 없음", value: 0, description: "딩크"},
              { label: "자녀 1명", value: 1, description: "1명" },
              { label: "자녀 2명", value: 2, description: "2명"},
            ]}
          />
        </Section>

        {/* ===================== */}
        {/* 7. 주택 계획 */}
        {/* ===================== */}
        <Section
          title="주택 계획"
          description="주거 형태 및 주택 구입 시점을 설정합니다."
        >
          {/* 현재 거주 상태 */}
          <SelectCard
            title="현재 거주 상태"
            value={plan.housingBase}
            options={[
              { label: "부모님 집 거주", value: "family" },
              { label: "전세 거주", value: "jeonse" },
              { label: "월세 거주", value: "monthly" },
              { label: "이미 집이 있음", value: "own" },
            ]}
            onChange={(v) =>
              onChange(p => ({
                ...p,
                housingBase: v as HousingBaseType,

                housingFuture: v === "own" ? "no_purchase" : p.housingFuture,
                housingPurchaseAge: v === "own" ? null : p.housingPurchaseAge,

                // 주거 변경 시 관련 자산 초기화
                initialAsset: {
                  ...p.initialAsset,
                  deposit: null,
                  houseValue: null,
                },
              }))
            }
          />

          {/* 🔵 전세 */}
          {plan.housingBase === "jeonse" && (
            <NumericInputCard
              title="전세 보증금"
              value={plan.initialAsset.deposit ?? 0}
              unit="만원"
              presets={[
                { label: "1억", value: 10000 },
                { label: "2억", value: 20000 },
                { label: "3억", value: 30000 },
              ]}
              onChange={(v) =>
                onChange(p => ({
                  ...p,
                  initialAsset: {
                    ...p.initialAsset,
                    deposit: v,
                    houseValue: null,
                  },
                }))
              }
            />
          )}

          {/* 🔵 월세 */}
          {plan.housingBase === "monthly" && (
            <>
              <NumericInputCard
                title="월세 보증금"
                value={plan.initialAsset.deposit ?? 0}
                unit="만원"
                presets={[
                  { label: "1천", value: 1000 },
                  { label: "3천", value: 3000 },
                  { label: "5천", value: 5000 },
                ]}
                onChange={(v) =>
                  onChange(p => ({
                    ...p,
                    initialAsset: {
                      ...p.initialAsset,
                      deposit: v,
                      houseValue: null,
                    },
                  }))
                }
              />

              <NumericInputCard
                title="월세"
                value={plan.monthlyRent ?? 0}
                unit="만원"
                presets={[
                  { label: "50", value: 50 },
                  { label: "80", value: 80 },
                  { label: "120", value: 120 },
                ]}
                onChange={(v) =>
                  onChange(p => ({
                    ...p,
                    monthlyRent: v,
                  }))
                }
              />
            </>
          )}

          {/* 🔵 이미 집이 있음 */}
          {plan.housingBase === "own" && (
            <NumericInputCard
              title="보유 주택 가치"
              value={plan.initialAsset.houseValue ?? 0}
              unit="만원"
              presets={[
                { label: "6억", value: 60000 },
                { label: "9억", value: 90000 },
                { label: "15억", value: 150000 },
              ]}
              onChange={(v) =>
                onChange(p => ({
                  ...p,
                  initialAsset: {
                    ...p.initialAsset,
                    houseValue: v,
                    deposit: null,
                  },
                }))
              }
            />
          )}

          {/* 🔵 향후 계획 */}
          {plan.housingBase !== "own" && (
            <SelectCard
              title="주택 계획"
              value={plan.housingFuture}
              options={[
                { label: "현재 형태 유지", value: "no_purchase" },
                { label: "향후 주택 구매", value: "buy" }
              ]}
              onChange={(v) =>
                onChange(p => ({
                  ...p,
                  housingFuture: v as HousingFuturePlan,
                  housingPurchaseAge:
                    v === "buy"
                      ? p.marriageAge
                      : v === ""
                      ? (p.housingPurchaseAge ?? p.marriageAge)
                      : null,
                }))
              }
            />
          )}

          {/* 🔵 직접 시점 입력 */}
          {plan.housingBase !== "own" &&
            plan.housingFuture === "buy" && (
              <NumericInputCard
                title="주택 매입 시점"
                value={plan.housingPurchaseAge ?? plan.marriageAge}
                unit="세"
                presets={[
                  { label: "결혼 시점", value: plan.marriageAge },
                  { label: "결혼 2년 후", value: plan.marriageAge + 2 },
                  { label: "결혼 5년 후", value: plan.marriageAge + 5 },
                ]}
                onChange={(v) =>
                  onChange(p => ({
                    ...p,
                    housingPurchaseAge: v,
                    housingFuture: "buy",
                  }))
                }
              />
            )}
        </Section>


        <Section
          title="초기 자산"
          description="증여·상속 등 현재 보유하고 있는 자산을 미리 설정할 수 있습니다."
        >
          <SelectCard
            title="초기 자산"
            value={plan.initialAsset.type}
            options={[
              { label: "없음", value: "none" },
              { label: "현금", value: "cash" }
            ]}
            onChange={(v) =>
              onChange(p => {
                return {
                  ...p,
                  initialAsset: {
                    type: v as InitialAssetType,
                    amount: v === 'cash' ? (p.initialAsset.amount ?? 0) : null,
                    houseValue: null,
                    deposit: null,
                  },
                }
              })
            }
          />

          {/* 현금 */}
          {plan.initialAsset.type === 'cash' && (
            <NumericInputCard
              title="초기 현금 자산"
              value={plan.initialAsset.amount ?? 0}
              unit="만원"
              presets={[
                { label: "2천", value: 2000 },
                { label: "5천", value: 5000 },
                { label: "1억", value: 10000 },
              ]}
              onChange={(v) =>
                onChange(p => ({
                  ...p,
                  initialAsset: {
                    ...p.initialAsset,
                    amount: v,
                  },
                }))
              }
            />
          )}
        </Section>

        <Section
          title="투자 성향"
          description="자산 운용 리스크 성향을 선택합니다."
        >
          <SelectCard
            title="투자 성향"
            value={plan.investment}
            onChange={(v) =>
              onChange(p => ({ ...p, investment: v as InvestmentStyle}))
            }
            options={[
              { label: "안정형", value: "stable_plus", description: "리스크 완화, 3:7"},
              { label: "중립형", value: "neutral", description: "균형 추구, 5:5" },
              { label: "적극형", value: "active", description: "성장 중심, 7:3"},
            ]}
          />
        </Section>
      </div>
    </main>
  )
}
