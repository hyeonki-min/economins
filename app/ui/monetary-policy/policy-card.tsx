import Link from "next/link";

export default function PolicyCard() {
  return (
    <section className="rounded-xl px-6 py-5 
      bg-gradient-to-r from-gray-100 to-gray-200 
      border border-gray-200
      hover:border-gray-300
      hover:shadow-sm
      ">
      <Link
        href="/monetary-policy"
        className="
          group flex items-start justify-between gap-6
          hover:opacity-90
        "
      >
        <div>
          <h2 className="text-xl font-semibold text-slate-900 leading-tight">
            기준금리는 어떤 기준으로 결정될까?
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            한국은행 금융통화위원회가 발표한 통화정책방향 결정회의를 요약해 정리했습니다.
          </p>

          <p className="text-sm text-slate-500 mt-1">
            기준금리 결정 배경과 경제흐름을 함께 확인할 수 있습니다.
          </p>

          <p className="sr-only">
            한국은행 통화정책방향 결정회의 요약과 금융통화위원회 기준금리 결정 과정,
            경제흐름 분석 자료
          </p>
        </div>

        <span
          className="
            text-slate-400 transition-transform
            group-hover:translate-x-1 group-hover:text-gray-600
          "
          aria-hidden
        >
          →
        </span>
      </Link>
    </section>
  );
}
