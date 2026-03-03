import type { Metadata } from "next";
import MidLoanCalculator from "@/app/ui/mid-loan/mid-loan-calculator";


export const metadata: Metadata = {
  title: "중도금 대출 이자 계산기 | 입주 시 실제로 얼마가 필요할까?",
  description:
    "중도금 대출 이자를 회차별 실행일 기준으로 계산하고 입주 시 필요한 총 정산 금액을 확인하세요. 회차별 실행일과 금액을 직접 수정할 수 있는 고급 계산기입니다.",
  keywords: [
    "중도금 대출 이자 계산기",
    "중도금 이자 계산",
    "중도금 대출 상환",
    "입주 시 필요 자금",
    "중도금 계산법",
  ],
  openGraph: {
    title: "중도금 대출 이자 계산기",
    description:
      "중도금 이자를 실행일부터 입주일까지 정확하게 계산하세요.",
    type: "website",
    locale: "ko_KR",
    url: "https://economins.com/calculator/mid-loan",
    siteName: "Economins",
  },
  twitter: {
    card: "summary_large_image",
    title: "중도금 대출 이자 계산기",
    description:
      "입주 시 필요한 총 정산 금액까지 계산해보세요.",
  }
};

export default function Page() {
  return (
    <>
      <MidLoanCalculator />
    </>
  );
}