'use client'

import { useLifeScroll } from '@/app/hooks/use-life-scroll'
import { getLifeState } from '@/app/lib/simulator/life-engine'
import { calculateSimpleFinance } from '@/app/lib/simulator/simple-finance-engine'
import FinanceMiniCard from '@/app/ui/simulator/finance-mini-card'
import AgeDisplay from '@/app/ui/simulator/age-display'
import { useEffect, useState } from 'react'
import { FinancialStressIndicator } from '@/app/ui/simulator/finance-stress-indicator'
import { LifePlanState } from '@/app/lib/simulator/types'
import { ActiveKey } from '@/app/lib/definitions'
import { useLifeSwipe } from '@/app/hooks/use-life-swipe'


type Props<T extends HTMLElement = HTMLDivElement> = {
  scrollRef: React.RefObject<T | null>
  plan: LifePlanState
  setMobileMode: React.Dispatch<
    React.SetStateAction<"simulation" | "plan">
  >
}

export default function Simulation({ scrollRef, plan, setMobileMode }: Props) {
  const startAge = plan.age
  const maxAge = plan.retirementAge
  const [age, setAge] = useState(startAge)

  useEffect(() => {
    setAge(startAge)
  }, [startAge])

  useLifeScroll(scrollRef, setAge, startAge, maxAge)
  useLifeSwipe(scrollRef, setAge, startAge, maxAge)

  const finance = calculateSimpleFinance(plan, age)
  const { labels, riskLevel } = getLifeState(age, plan, finance)
  const [active, setActive] = useState<ActiveKey>(null);

  return (
    <div className="mx-auto w-full max-w-md sm:max-w-lg flex flex-col items-center justify-center text-center px-2 py-2 sm:py-0 transition">

      <AgeDisplay age={age} />

      <div className="text-xl text-gray-500 mb-4">
        <span className="hidden lg:inline">
          스크롤로 인생 재무 흐름을 탐험하세요
        </span>
        <span className="inline lg:hidden">
          스와이프로 인생 재무 흐름을 탐험하세요
        </span>
      </div>

      {labels.length > 0 && (
        <div className="space-y-2 mb-4">
          {labels.map((e, i) => (
            <div key={i} className="text-lg">{e}</div>
          ))}
        </div>
      )}

      <FinancialStressIndicator riskLevel={riskLevel}/>

      <FinanceMiniCard data={finance} active={active} setActive={setActive} />

      {setMobileMode && (
        <button
          onClick={() => setMobileMode("plan")}
          className="
            lg:hidden
            w-full
            mt-4
            py-3
            rounded-xl
            bg-slate-900
            text-white
            font-medium
            transition
            hover:ring-2 hover:ring-slate-900/30
            active:ring-2 active:ring-slate-900
            active:scale-[0.98]
          "
        >
          계획 변경하기
        </button>
      )}
    </div>
  )
}
