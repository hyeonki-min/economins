import { LifePlanState, FinanceCardData, LifeEvent } from "@/app/lib/simulator/types"


const eventMeta = {
  marriage: { label: '💍 결혼 자금 지출', risk: 1 },
  childbirth: { label: '👶 출산/육아 비용', risk: 1 },
  academyFee: { label: '📚 학원비', risk: 1},
  homePurchase: { label: '🏠 주담대 상환 압박', risk: 2 },
} as const


export function getLifeState(
  cursorAge: number,
  plan: LifePlanState,
  finance: FinanceCardData
) {
  const events = buildLifeEvents(plan)

  let labels: string[] = []
  let eventRisk = 0

  for (const e of events) {
    const meta = eventMeta[e.type]

    if (e.type === 'marriage' && e.age === cursorAge) {
      labels.push(meta.label)
      eventRisk += meta.risk
    }

    if (e.type === 'childbirth' && e.age === cursorAge) {
      labels.push(meta.label)
      eventRisk += meta.risk
    }

    if (
      e.type === 'academyFee' &&
      cursorAge >= e.age &&
      cursorAge < e.age + (e.durationYears ?? 0)
    ) {
      labels.push(meta.label)
      eventRisk += meta.risk
    }

    if (
      e.type === 'homePurchase' &&
      cursorAge >= e.age &&
      finance.liability.mortgage.remainingLoan > 0
    ) {
      labels.push(meta.label)
      eventRisk += meta.risk
    }
  }

  // 🔥 재정 기반 압박
  const stressFromSaving = finance.stressFromSaving
  const stressFromGrowth = finance.stressFromGrowth

  const baseStress =
    stressFromSaving * 0.6 +
    stressFromGrowth * 0.4

  // 🔥 이벤트 영향 가중
  const totalStress = baseStress + eventRisk * 0.15

  let riskLevel: 0 | 1 | 2 = 0
  if (totalStress > 0.8) riskLevel = 2
  else if (totalStress > 0.4) riskLevel = 1

  return {
    labels,
    riskLevel,
    stressScore: totalStress,
  }
}

function buildLifeEvents(plan: LifePlanState): LifeEvent[] {
  const events: LifeEvent[] = []

  // 💍 결혼
  if (plan.marriageAge > 0) {
    events.push({
      type: 'marriage',
      age: plan.marriageAge,
    })
  }

  // 👶 출산 (결혼 2년 후부터 순차)
  for (let i = 0; i < plan.children; i++) {
    events.push({
      type: 'childbirth',
      age: plan.marriageAge + 2 + i * 2,
    })

    // 📚 학원비 (초등 ~ 고등, 12년)
    events.push({
      type: 'academyFee',
      age: plan.marriageAge + 2 + 8 + i * 2, // 대략 초등 진입
      durationYears: 12,
    })
  }

  // 🏠 주택 구매
  if (plan.housingPurchaseAge && plan.housingPurchaseAge > 0) {
    events.push({
      type: 'homePurchase',
      age: plan.housingPurchaseAge,
    })
  }

  return events
}
