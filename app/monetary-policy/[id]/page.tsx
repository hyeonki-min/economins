import { fetchDataset } from '@/app/lib/fetch-data';
import { redirect } from "next/navigation";
import { getLatestAvailablePolicyId, getPrevNextPolicyId, getKoreanMeetingDate, checkValidId, getValidIndex } from '@/app/lib/policy';

import DecisionIssueCard from '@/app/ui/monetary-policy/decision-issue-card';
import PrevNextFab from '@/app/ui/monetary-policy/prev-next-fab';
import { Metadata } from 'next';
import { RouteProps, MonetaryPolicyBrief } from '@/app/lib/definitions';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '한국은행 통화정책방향 결정회의 요약 - economins',
    description: '한국은행에서 발표하는 통화정책방향 결정회의의 핵심 내용을 쉽고 명확하게 요약해 제공합니다. 기준금리 동향, 금통위의 판단 근거, 경제 전망, 주요 리스크 요인을 빠르게 확인할 수 있습니다.',
  };
}

export default async function Page({ params, searchParams }: RouteProps) {
  const now = new Date();
  const id = params.id;

  const isValidId = checkValidId(id);
  const latestId = getLatestAvailablePolicyId(now);
  const { prev, next } = getPrevNextPolicyId(id, now);

  if (isValidId && params.id !== latestId && getValidIndex(id) > getValidIndex(latestId)) {
    redirect(`/monetary-policy/${latestId}`);
  }

  if (!isValidId) {
    redirect(`/monetary-policy/${latestId}`);
  }
  
  const koreanDate = getKoreanMeetingDate(id);
  const decisions = await fetchDataset<MonetaryPolicyBrief>(`monetary-policy/${id}/bok-decision`);
  const issues = await fetchDataset<MonetaryPolicyBrief>(`monetary-policy/${id}/bok-issue`);
  
  return (
    <div
      className="min-h-[calc(100vh-96px)] w-full relative flex items-center justify-center"
    >
      <PrevNextFab direction="prev" targetId={prev} />
      <PrevNextFab direction="next" targetId={next} />

      <DecisionIssueCard koreanDate={koreanDate} decisions={decisions} issues={issues} />
    </div>
  );
}
