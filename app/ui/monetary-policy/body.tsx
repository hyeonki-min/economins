import { fetchDataset } from '@/app/lib/fetch-data';

import { getPrevNextPolicyId, getKoreanMeetingDate } from '@/app/lib/policy';
import { MonetaryPolicyBrief } from '@/app/lib/definitions';
import DecisionIssueCard from '@/app/ui/monetary-policy/decision-issue-card';
import PrevNextFab from '@/app/ui/monetary-policy/prev-next-fab';

type Props = {
  id: string;
};

export async function MonetaryPolicyPageBody({ id }: Props) {
  const now = new Date();

  const { prev, next } = getPrevNextPolicyId(id, now);
  const koreanDate = getKoreanMeetingDate(id);

  const decisions = await fetchDataset<MonetaryPolicyBrief>(
    `monetary-policy/${id}/bok-decision`
  );
  const issues = await fetchDataset<MonetaryPolicyBrief>(
    `monetary-policy/${id}/bok-issue`
  );

  return (
    <div className="min-h-[calc(100vh-96px)] w-full relative flex items-center justify-center">
      <PrevNextFab direction="prev" targetId={prev} />
      <PrevNextFab direction="next" targetId={next} />

      <DecisionIssueCard koreanDate={koreanDate} decisions={decisions} issues={issues} />
    </div>
  );
}