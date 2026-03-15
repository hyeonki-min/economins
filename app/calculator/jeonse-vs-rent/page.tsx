import type { Metadata } from "next"
import RentStrategyCalculator from "@/app/calculator/jeonse-vs-rent/rent-strategy-calculator";

export const metadata: Metadata = {
  title: "전세 vs 월세 계산기 | 전월세 전환 및 자산 비교 - economins",
  description:
    "전세와 월세 중 어떤 선택이 유리한지 계산해보세요. 전월세 전환율, 투자 수익률, 월세 절약 효과를 반영하여 거주기간 동안의 자산 차이를 비교할 수 있습니다.",
  keywords: [
    "전세 월세 계산기",
    "전월세 전환 계산기",
    "전세 월세 비교",
    "전세 vs 월세",
    "전세 월세 전환율",
    "월세 전세 전환 계산",
  ],
  openGraph: {
    title: "전세 vs 월세 계산기",
    description:
      "전세와 월세 선택에 따른 자산 차이를 계산합니다. 월세 절약, 투자 수익, 전월세 전환율을 반영한 시뮬레이션.",
    type: "website",
  },
}

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">
          전세 vs 월세 계산기
        </h1>

        <p className="text-gray-600 mt-3 leading-relaxed">
          전세와 월세 중 어떤 선택이 더 유리한지 계산해보세요.
          전월세 전환율, 월세 절약 금액, 투자 수익률을 반영하여
          거주기간 동안의 <strong>자산 증가 효과</strong>를 비교할 수 있습니다.
        </p>

        <p className="text-gray-500 text-sm mt-3">
          전세 → 월세 전환 시 남은 보증금 투자 효과와  
          월세 → 전세 전환 시 절약되는 월세 투자 효과를
          함께 분석합니다.
        </p>
      </header>

      <RentStrategyCalculator />
    </main>
  )
}