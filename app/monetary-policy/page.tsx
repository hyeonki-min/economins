import { redirect } from "next/navigation";
import { getLatestAvailablePolicyId } from '@/app/lib/policy';

export default function Page() {
  const latest = getLatestAvailablePolicyId(new Date());
  redirect(`/monetary-policy/${latest}`);
}