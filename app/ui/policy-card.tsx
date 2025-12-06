import Link from "next/link";

export default function PolicyCard() {
  return (
    <div className="px-2 py-8">
      <Link
        href={`/monetary-policy`}
        className="items-center rounded-lg border border-slate-300 p-4 text-slate-700 ring-1 ring-transparent hover:bg-slate-200"
      >
        📝 한국은행 통화정책방향 결정회의 요약 ↗
      </Link>
    </div>
  );
}
