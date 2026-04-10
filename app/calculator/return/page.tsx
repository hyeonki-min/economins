import type { Metadata } from "next"
import ProfitCalculatorClient from "./profit-calculator-client"

export const metadata: Metadata = {
  title: "수익률 계산기 | 복리 계산기 · 목표 수익률 · 누적 수익률 계산",
  description:
    "목표 수익률을 달성하려면 기간별 몇 퍼센트의 수익이 필요한지 계산하고, 3% 수익률을 4번 반복했을 때 총 수익률이 얼마인지 복리 기준으로 확인할 수 있는 수익률 계산기입니다.",
  keywords: [
    "수익률 계산기",
    "복리 계산기",
    "누적 수익률 계산기",
    "목표 수익률 계산",
    "기간별 수익률 계산",
    "복리 수익률",
    "3% 수익률 4번",
    "투자 수익률 계산기",
  ],
  openGraph: {
    title: "수익률 계산기 | 목표 수익률·복리·누적 수익률 계산",
    description:
      "목표 수익률을 달성하기 위한 기간별 수익률과 반복 수익률의 누적 결과를 복리 기준으로 계산합니다.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "수익률 계산기 | 목표 수익률·복리·누적 수익률 계산",
    description:
      "목표 수익률과 기간을 넣으면 매 기간 필요한 수익률을 계산하고, 반복 수익률의 최종 누적 수익률도 복리 기준으로 보여줍니다.",
  },
  alternates: {
    canonical: "/calculator/return",
  },
}

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
        <header className="max-w-2xl">
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            수익률 계산기 · 복리 계산기
          </h1>

          <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">
            복리 계산기를 통해 목표 수익률을 달성하려면 기간별로 몇 퍼센트의 수익이 필요한지 계산하고,
            같은 수익률을 여러 번 반복했을 때 최종 수익률이 얼마나 되는지 확인할 수 있습니다.
          </p>
        </header>

        <section className="mt-10">
          <ProfitCalculatorClient />
        </section>

      </section>
    </main>
  )
}