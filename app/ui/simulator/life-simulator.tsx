'use client'

import { LifePlanState } from '@/app/lib/simulator/types'
import ScenarioPlan from '@/app/ui/simulator/life-scenario-form'
import Simulation from '@/app/ui/simulator/simulation'
import { useRef, useState } from 'react'

export default function LifeSimulatorClient() {
  const desktopScrollRef = useRef<HTMLDivElement>(null)
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const [mobileMode, setMobileMode] = useState<"simulation" | "plan">("simulation")

  const [plan, setPlan] = useState<LifePlanState>({
    age: 30,
    retirementAge: 60,
    salary: 4000,
    consumptionRate: 0.5,
    marriageAge: 32,
    children: 0,

    housingBase: 'family',
    housingFuture: 'no_purchase',
    housingPurchaseAge: 32,

    investment: 'neutral',
    initialAsset: {
      type: 'none',
      amount: null,
      houseValue: null,
      deposit: 0
    },
  })

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-8">
      {/* Desktop Left */}
      <aside className="hidden lg:block">
        <div
          ref={desktopScrollRef}
          className="sticky top-24 touch-none select-none"
        >
          <Simulation
            scrollRef={desktopScrollRef}
            plan={plan}
            setMobileMode={setMobileMode}
          />
        </div>
      </aside>

      {/* Desktop Right (NO overflow-y-auto) */}
      <div className="hidden lg:block">
        <ScenarioPlan
          plan={plan}
          onChange={setPlan}
          setMobileMode={setMobileMode}
        />
      </div>

      {/* ================= Mobile ================= */}
      <div
        ref={mobileScrollRef}
        className="
          lg:hidden
          relative
          touch-none
          overscroll-y-contain
        "
      >
        <Simulation
          scrollRef={mobileScrollRef}
          plan={plan}
          setMobileMode={setMobileMode}
        />

        {/* Overlay */}
        <div
          className={`
            fixed inset-0 bg-black/30 z-40
            transition-opacity duration-300
            ${mobileMode === "plan"
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"}
          `}
          onClick={() => setMobileMode("simulation")}
        />

        {/* Slide Up Panel */}
        <div
          className={`
            fixed bottom-0 left-0 right-0 z-50
            bg-white
            rounded-t-3xl
            shadow-2xl
            transition-transform duration-300 ease-out
            ${mobileMode === "plan"
              ? "translate-y-0"
              : "translate-y-full"}
          `}
          style={{ maxHeight: "95vh" }}
        >
          <div className="flex justify-center py-3">
            <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
          </div>

          <div
            className="
              px-6 pb-10
              overflow-y-auto
              max-h-[90vh]
              overscroll-y-contain
            "
          >
            <ScenarioPlan
              plan={plan}
              onChange={setPlan}
              setMobileMode={setMobileMode}
            />
          </div>
        </div>
      </div>

    </div>
  )
}
