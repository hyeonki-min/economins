import type { Metadata } from "next";
import { ValueSimulator } from "@/app/calculator/cash-value/value-simulator";

export const metadata: Metadata = {
  title: "1억을 그냥 두면 생기는 일 | 10년 투자 비교 시뮬레이터",
  description:
    "1억을 현금, 예금, 코스피, 금, 아파트에 투자했다면 10년 뒤 얼마가 될까요? 물가 상승까지 반영한 실제 가치 변화를 확인해보세요.",
  alternates: {
    canonical: "/calculator/value",
  },
};

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-14 space-y-10">
      
      <header className="space-y-4">
        <h1 className="text-3xl font-bold leading-tight">
          1억을 그냥 두면 생기는 일
        </h1>

        <p className="text-gray-600">
          현금, 예금, 코스피, 금, 아파트에 따라 10년 뒤 자산 가치는 어떻게 달라질까요?
        </p>

        <p className="text-gray-500 text-sm">
          물가 상승까지 반영한 실제 가치 변화를 비교해보세요.
        </p>
      </header>

      <ValueSimulator />

    </main>
  );
}