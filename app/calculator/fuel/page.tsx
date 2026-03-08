import { Metadata } from "next";
import FuelCalculator from "@/app/calculator/fuel/fuel-calculator";

export const metadata: Metadata = {
  title:
    "주유비 계산기 | 만땅 가격 · 기름값 변동 계산 (휘발유·경유) - Economins",

  description:
    "주유비 계산기로 휘발유·경유 만땅 가격, 5만원 주유 시 몇 리터인지, 기름값 50원·100원 변동 영향, 다른 주유소 이동 시 절약 금액을 계산해보세요.",

  keywords: [
    "주유 계산기",
    "주유비 계산기",
    "휘발유 만땅 가격",
    "경유 만땅 가격",
    "기름값 계산기",
    "5만원 주유 몇리터",
    "주유비 계산",
    "기름값 변동 계산",
  ],

  openGraph: {
    title: "주유비 계산기 | 만땅 가격 · 기름값 변동 계산",
    description:
      "휘발유·경유 만땅 가격 계산, 기름값 변동 영향, 주유 금액별 리터 계산, 다른 주유소 이동 시 절약 금액을 확인해보세요.",
    type: "website",
    siteName: "Economins",
    locale: "ko_KR",
  },

  twitter: {
    card: "summary_large_image",
    title: "주유비 계산기 | 만땅 가격 · 기름값 변동 계산",
    description:
      "만땅 주유 가격, 5만원 주유 리터 계산, 기름값 변동 영향까지 한 번에 계산하는 주유 계산기.",
  },

  alternates: {
    canonical: "https://economins.com/calculator/fuel",
  },
};

export default function Page() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-bold mb-2">
        주유비 계산기
      </h1>

      <p className="text-gray-600 mb-8">
        휘발유·경유 만땅 가격, 주유 금액별 리터, 기름값 변동 영향과
        다른 주유소 이동 시 절약 금액을 계산해보세요.
      </p>

      <FuelCalculator />

    </main>
  );
}