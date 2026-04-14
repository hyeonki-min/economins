import PortfolioClient from "./portfolio-client"

export const metadata = {
  title: "포트폴리오 분배 계산기 | ETF 자산배분·투자 비중·수량 계산",
  description:
    "투자금액을 입력하면 ETF·주식·채권·금 포트폴리오 비중에 따라 실제 매수 금액과 수량을 계산합니다. 올웨더, 버핏, 보글 3펀드 포트폴리오 지원.",
  keywords: [
    "포트폴리오 계산기",
    "자산배분 계산기",
    "ETF 포트폴리오",
    "투자 비중 계산",
    "올웨더 포트폴리오",
    "버핏 포트폴리오",
    "보글 3펀드",
    "ETF 수량 계산",
  ],
  openGraph: {
    title: "포트폴리오 분배 계산기",
    description:
      "투자금으로 ETF·주식 포트폴리오를 실제 수량 단위까지 계산해보세요.",
    type: "website",
  },
  alternates: {
    canonical: "https://economins.com/portfolio",
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function Page() {
  return (
  <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-6 md:py-10 space-y-6">
    <section className="rounded-[28px] border border-gray-200 bg-white px-5 py-6 shadow-sm md:px-7 md:py-7">
      <div className="max-w-3xl">
        <p className="text-sm font-medium text-gray-500">
          포트폴리오 계산기 · ETF 자산배분
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 md:text-4xl">
          투자금으로 ETF 포트폴리오를 실제 매수 수량까지 계산하세요
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
          총 투자금 입력 후 올웨더, 버핏, 보글 3펀드 포트폴리오를 선택하면
          자산 비중에 따른 투자 금액과 실제 매수 가능한 수량을 자동으로 계산하는
          포트폴리오 계산 도구입니다.
        </p>
      </div>
    </section>
    <PortfolioClient />
  </main>
  );
}