import { redirect } from "next/navigation";
import { getLatestAvailablePolicyId, checkValidId, getValidIndex } from '@/app/lib/policy';

import { Metadata } from 'next';
import { RouteProps } from '@/app/lib/definitions';
import { MonetaryPolicyPageBody } from "@/app/ui/monetary-policy/body";


export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { id } = await params;

  const now = new Date();
  const latestId = getLatestAvailablePolicyId(now);
  const isLatest = id === latestId;

  return {
    title: '한국은행 통화정책방향 결정회의 요약 - economins',
    description:
      '한국은행에서 발표하는 통화정책방향 결정회의의 핵심 내용을 쉽고 명확하게 요약해 제공합니다. 기준금리 동향, 금통위의 판단 근거, 경제 전망, 주요 리스크 요인을 빠르게 확인할 수 있습니다.',
    alternates: {
      canonical: '/monetary-policy',
    },
    robots: isLatest
      ? { index: true, follow: true } // 최신만 인덱스 허용(원하면 false로 바꿔도 됨)
      : { index: false, follow: true }, // 과거/미래는 검색결과 제외, 링크 탐색은 허용
  };
}

export default async function Page({ params }: RouteProps) {
  const now = new Date();
  const { id } = await params;

  const isValidId = checkValidId(id);
  const latestId = getLatestAvailablePolicyId(now);

  if (!isValidId) {
    redirect('/monetary-policy');
  }

  if (id !== latestId && getValidIndex(id) > getValidIndex(latestId)) {
    redirect('/monetary-policy');
  }

  return <MonetaryPolicyPageBody id={id} />;
}