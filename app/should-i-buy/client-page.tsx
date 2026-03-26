"use client"

import { useMemo, useState } from "react"
import { getDecision } from "@/app/lib/should-i-buy/get-decision"
import {
  BottomSheet,
  DecisionCircle,
  MarketInlineSelector,
  PrimaryEvent,
} from "@/app/ui/should-i-buy/component"

export default function ClientPage({
  initialMarket,
  initialResult,
}: {
  initialMarket: "KR" | "US"
  initialResult: ReturnType<typeof getDecision>
}) {
  const [market, setMarket] = useState(initialMarket)
  const [open, setOpen] = useState(false)

  const result = useMemo(() => {
    if (market === initialMarket) return initialResult
    return getDecision(market)
  }, [market, initialMarket, initialResult])

  return (
    <main className="min-h-screen px-4 py-10 max-w-md mx-auto">
      <MarketInlineSelector market={market} onChange={setMarket} />

      <DecisionCircle status={result.status} />

      <PrimaryEvent
        event={
          result.primaryEvent ?? {
            name: "시장 안정",
            summary: "특별한 변동성 없음",
            level: "LOW",
          }
        }
        onClick={() => setOpen(true)}
      />

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        events={result.events}
      />
    </main>
  )
}