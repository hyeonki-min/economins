import Link from "next/link";

export default function PolicyCard() {
  return (
    <section className="mt-6 rounded-xl bg-white px-4 py-5 border-l-4 border-blue-400">
      <Link
        href="/monetary-policy"
        className="
          group flex items-center justify-between
          text-slate-700
        "
      >
        <div>
          <h3 className="font-semibold text-slate-900">
            통화정책방향 결정회의 요약 - 한국은행
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            금융통화위원회는 기준금리를 결정할 때 경기와 물가, 금융시장 상황을 함께 점검합니다.
          </p>
          <p className="text-sm text-slate-500 mt-1">
            통화정책방향 결정회의 요약은 이러한 판단 과정을 정리한 자료로, 경제 흐름을 공부하는 데 유용한 참고 자료가 됩니다.
          </p>
        </div>

        <span
          className="
            text-slate-400 transition-transform
            group-hover:translate-x-1
          "
          aria-hidden
        >
          →
        </span>
      </Link>
    </section>
  );
}
