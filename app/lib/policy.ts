export const VALID_POLICY_IDS = [
  "2025-01",
  "2025-02",
  "2025-04",
  "2025-05",
  "2025-07",
  "2025-08",
  "2025-10",
  "2025-11"
] as const;

export const POLICY_MEETING_DATES: Record<string, string> = {
  "2025-01": "2025-01-16",
  "2025-02": "2025-02-25",
  "2025-04": "2025-04-17",
  "2025-05": "2025-05-29",
  "2025-07": "2025-07-10",
  "2025-08": "2025-08-28",
  "2025-10": "2025-10-23",
  "2025-11": "2025-11-27"
};

export function checkValidId(id: any): boolean {
    return VALID_POLICY_IDS.includes(id);
}

export function getValidIndex(id: any): number {
    return VALID_POLICY_IDS.indexOf(id);
}

export function getLatestAvailablePolicyId(now: Date): string {
  const publishedIds = VALID_POLICY_IDS.filter(id => {
    const meetingDateStr = POLICY_MEETING_DATES[id];
    if (!meetingDateStr) return false;

    const meetingDate = new Date(meetingDateStr + "T23:59:59");

    return now >= meetingDate;
  });

  // 발표된 회기가 없다면 첫 회기 반환
  return publishedIds[publishedIds.length - 1] ?? VALID_POLICY_IDS[0];
}

export type PolicyId = typeof VALID_POLICY_IDS[number];

export function isValidPolicyId(id: string): id is PolicyId {
  return (VALID_POLICY_IDS as readonly string[]).includes(id);
}

export function getPrevNextPolicyId(currentId: string, now: Date) {
  if (!isValidPolicyId(currentId)) {
    return { prev: null, next: null };
  }

  const index = VALID_POLICY_IDS.indexOf(currentId);  
  if (index === -1) return { prev: null, next: null };

  // ▣ prev: 단순히 이전 index → ALWAYS VALID
  const prev = index > 0 ? VALID_POLICY_IDS[index - 1] : null;

  // ▣ next: 다음 index 후보가 발표된 상태인지 체크
  const nextCandidate = VALID_POLICY_IDS[index + 1];

  let next: string | null = null;

  if (nextCandidate) {
    const meetingDateStr = POLICY_MEETING_DATES[nextCandidate];
    const meetingDate = new Date(meetingDateStr + "T23:59:59");

    // 발표일이 현재(now)보다 과거여야 이동 가능
    if (now >= meetingDate) {
      next = nextCandidate;
    }
  }

  return { prev, next };
}

export function formatKoreanDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);

  return `${year}년 ${month}월 ${day}일`;
}

export function getKoreanMeetingDate(id: string): string {
  const dateStr = POLICY_MEETING_DATES[id];
  if (!dateStr) return "";

  return formatKoreanDate(dateStr);
}
