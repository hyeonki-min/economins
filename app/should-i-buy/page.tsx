import type { Metadata } from "next"
import { getDecision } from "@/app/lib/should-i-buy/get-decision"
import ClientPage from "./client-page"

export const metadata: Metadata = {
  title: "지금 사도 될까? | 시장 변동성 판단",
  description:
    "현재 시장이 안정, 중립, 변동성 상태인지 빠르게 확인하세요. 투자 타이밍 판단을 위한 간단한 시각화.",
  keywords: [
    "주식 타이밍",
    "시장 변동성",
    "매수 타이밍",
    "VIX",
    "투자 판단",
  ],
  openGraph: {
    title: "지금 사도 될까?",
    description: "시장 변동성 기반 투자 판단",
    type: "website",
  },
}

export default function Page() {
  const initialMarket: "KR" | "US" = "US"

  const initialResult = getDecision(initialMarket)

  return (
    <ClientPage
      initialMarket={initialMarket}
      initialResult={initialResult}
    />
  )
}