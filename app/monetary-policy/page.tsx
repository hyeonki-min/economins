import type { Metadata } from 'next';
import { MonetaryPolicyPageBody } from '@/app/ui/monetary-policy/body';
import { getLatestAvailablePolicyId } from '@/app/lib/policy';


export const metadata: Metadata = {
  title: '한국은행 통화정책방향 결정회의 요약 - economins',
  description:
    '한국은행에서 발표하는 통화정책방향 결정회의의 핵심 내용을 쉽고 명확하게 요약해 제공합니다. 기준금리 동향, 금통위의 판단 근거, 경제 전망, 주요 리스크 요인을 빠르게 확인할 수 있습니다.',
  alternates: {
    canonical: 'https://economins.com/monetary-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Page() {
  const latestId = getLatestAvailablePolicyId(new Date());

  return <MonetaryPolicyPageBody id={latestId} />;
}