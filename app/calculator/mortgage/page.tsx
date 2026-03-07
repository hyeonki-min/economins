import type { Metadata } from "next"
import MortgageClient from "./mortgage-client"


export const metadata: Metadata = {
  title:
    "주택담보대출 계산기 | LTV·DSR·우대금리·혼합/변동 금리 비교 - economins",

  description:
    "주택담보대출 계산기. 월 상환액, 총이자, LTV·DSR 기준 대출가능금액, 우대금리 0.1% 효과, 취득세·채권비용 등 부대비용, 5년 혼합금리 vs 변동금리 시나리오 비교까지 한 번에 계산합니다.",

  keywords: [
    "주택담보대출 계산기",
    "주담대 계산기",
    "LTV 계산기",
    "DSR 계산기",
    "대출 가능 금액 계산",
    "주택 대출 계산기",
    "우대금리 효과 계산",
    "혼합금리 변동금리 비교",
    "주택 취득세 계산",
  ],

  alternates: {
    canonical: "/calculator/mortgage",
  },

  openGraph: {
    title: "주택담보대출 계산기 | LTV·DSR·금리 시나리오 비교",
    description:
      "주택담보대출 월 상환액, 총이자, LTV·DSR 대출한도, 우대금리 효과, 취득세와 채권비용까지 한 번에 계산.",
    url: "https://economins.com/calculator/mortgage",
    siteName: "economins",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "주택담보대출 계산기",
    description:
      "월 상환액, 총이자, LTV·DSR 대출한도, 우대금리 효과, 혼합금리 vs 변동금리 비교.",
  },
}

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">
          주택담보대출 계산기
        </h1>

        <p className="text-sm text-gray-600">
          월 상환액, 총이자, <b>LTV·DSR 대출 가능 금액</b>, 
          <b>우대금리 0.1% 효과</b>, 
          <b>취득세·채권비용</b>, 
          <b>혼합금리 vs 변동금리 시나리오</b>를 한 번에 계산합니다.
        </p>
      </header>

      <MortgageClient />
    </main>
  )
}