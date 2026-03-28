import Link from 'next/link';
import { pretendard } from '@/app/ui/fonts';
import PolicyCard from '@/app/ui/monetary-policy/policy-card';
import EconomicTimeline from '@/app/ui/timeline'


export default async function Page() {
  return (
      <section className={`${pretendard.className}`}>
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-10">
           <header className="mb-8 space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              주요 경제 지표로 경제 흐름을 살펴보세요.
            </h1>
            <p className="text-sm text-gray-600">
              지표와 경제 이벤트를 함께 살펴보며 지금 경제가 어떤 방향에 있는지 한눈에 볼 수 있고,
              통화정책방향 결정회의 요약으로 현재 대한민국 경제 상황을 쉽게 이해할 수 있습니다.
            </p>
          </header>
          <PolicyCard></PolicyCard>

          <main className="py-14 space-y-14">
            <section>
              <h2 className="text-lg font-semibold text-gray-900">
                경제 인사이트
              </h2>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                시장 흐름과 주요 지표를 한눈에 확인하세요
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <Link
                  href="/overview"
                  className="
                    group relative rounded-xl border border-gray-200
                    bg-white p-5
                    transition
                    hover:bg-gray-50
                    hover:border-gray-300
                    hover:shadow-sm
                  "
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🧭</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 leading-tight">
                        경제 흐름 이해하기
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        실물경제·금리·자산시장을 핵심 지표로 정리했습니다. 경제흐름을 이해하는 다섯가지 지표를 확인하세요.
                      </p>
                    </div>
                    <span
                      className="
                        text-gray-400 transition-transform
                        group-hover:translate-x-1 group-hover:text-gray-600
                      "
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                </Link>

                <Link
                  href="/indicators"
                  className="
                    group relative rounded-xl border border-gray-200
                    bg-white p-5
                    transition
                    hover:bg-gray-50
                    hover:border-gray-300
                    hover:shadow-sm
                  "
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">📊</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 leading-tight">
                        경제 지표 전체 보기
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        모든 경제 지표를 한눈에 탐색하고 비교할 수 있습니다.
                      </p>
                    </div>
                    <span
                      className="
                        text-gray-400 transition-transform
                        group-hover:translate-x-1 group-hover:text-gray-600
                      "
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                </Link>

                <Link
                  href="/economic-cycle"
                  className="
                    group relative rounded-xl border border-gray-200
                    bg-white p-5
                    transition
                    hover:bg-gray-50
                    hover:border-gray-300
                    hover:shadow-sm
                  "
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🔄</span>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 leading-tight">
                        지금 경제는 어디 있을까?
                      </h3>

                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        물가와 경기 데이터를 기반으로 지금 경제가 어느 위치에 있는지 확인하고,
                        각 사이클에 따라 주식·채권·금·원자재 흐름을 이해할 수 있습니다.
                      </p>
                    </div>

                    <span
                      className="
                        text-gray-400 transition-transform
                        group-hover:translate-x-1 group-hover:text-gray-600
                      "
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                </Link>
              </div>
            </section>
            {/* 계산기 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900">
                계산기
              </h2>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                생활 속 의사결정을 도와주는 금융 계산기
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                 <Link
                  href="/simulator"
                  className="
                    group relative rounded-xl border border-gray-200
                    bg-white p-5
                    transition
                    hover:bg-gray-50
                    hover:border-gray-300
                    hover:shadow-sm
                  "
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">📈</span>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 leading-tight">
                        인생 재무 시뮬레이터
                      </h3>

                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        소득, 소비, 결혼, 주택, 자산 수익률까지.
                        당신의 선택이 시간이 지나 어떻게 쌓이는지
                        한눈에 확인해보세요.
                      </p>
                    </div>

                    <span
                      className="
                        text-gray-400 transition-transform
                        group-hover:translate-x-1 group-hover:text-gray-600
                      "
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                </Link>
                <Link
                  href="/calculator/mortgage"
                  className="
                    group relative rounded-xl border border-gray-200
                    bg-white p-5
                    transition
                    hover:bg-gray-50
                    hover:border-gray-300
                    hover:shadow-sm
                  "
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🏠</span>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 leading-tight">
                        주택담보대출 계산기
                      </h3>

                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        LTV·DSR 대출 가능 금액, 월 상환액, 총 이자,
                        우대금리 효과와 혼합·변동 금리 시나리오까지
                        한 번에 계산합니다.
                      </p>
                    </div>

                    <span
                      className="
                        text-gray-400 transition-transform
                        group-hover:translate-x-1 group-hover:text-gray-600
                      "
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                </Link>

                <Link
                  href="/calculator/mid-loan"
                  className="
                    group relative rounded-xl border border-gray-200
                    bg-white p-5
                    transition
                    hover:bg-gray-50
                    hover:border-gray-300
                    hover:shadow-sm
                  "
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🏗️</span>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 leading-tight">
                        중도금 대출 계산기
                      </h3>

                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        분양 아파트 중도금 대출 이자, 회차별 실행일,
                        금리 변화에 따른 총 이자 부담을 계산합니다.
                      </p>
                    </div>

                    <span
                      className="
                        text-gray-400 transition-transform
                        group-hover:translate-x-1 group-hover:text-gray-600
                      "
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                </Link>

                <Link
                  href="/calculator/fuel"
                  className="
                    group relative rounded-xl border border-gray-200
                    bg-white p-5
                    transition
                    hover:bg-gray-50
                    hover:border-gray-300
                    hover:shadow-sm
                  "
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">⛽</span>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 leading-tight">
                        주유비 계산기
                      </h3>

                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        휘발유·경유 만땅 가격, 주유 금액별 리터,
                        기름값 변동 영향과 다른 주유소 이동 시
                        절약 금액까지 계산합니다.
                      </p>
                    </div>

                    <span
                      className="
                        text-gray-400 transition-transform
                        group-hover:translate-x-1 group-hover:text-gray-600
                      "
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                </Link>

                <Link
                  href="/calculator/jeonse-vs-rent"
                  className="
                    group relative rounded-xl border border-gray-200
                    bg-white p-5
                    transition
                    hover:bg-gray-50
                    hover:border-gray-300
                    hover:shadow-sm
                  "
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🏠</span>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 leading-tight">
                        전세 vs 월세 계산기
                      </h3>

                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        전세와 월세 전환 시 자산 차이를 계산합니다.
                        전월세 전환율, 월세 절약 금액, 투자 수익률을
                        반영해 거주기간 동안의 자산 증가 효과를
                        비교합니다.
                      </p>
                    </div>

                    <span
                      className="
                        text-gray-400 transition-transform
                        group-hover:translate-x-1 group-hover:text-gray-600
                      "
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                </Link>

                <Link
                  href="/calculator/cash-value"
                  className="
                    group relative rounded-xl border border-gray-200
                    bg-white p-5
                    transition
                    hover:bg-gray-50
                    hover:border-gray-300
                    hover:shadow-sm
                  "
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">💸</span>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 leading-tight">
                        현금 가치 계산기
                      </h3>

                      <p className="mt-1 text-sm leading-relaxed text-gray-500">
                        1억을 그냥 두면 어떻게 달라질까요?
                        물가 상승에 따른 현금 가치 하락과
                        예금·금·코스피·아파트의 자산 차이를 비교합니다.
                      </p>
                    </div>

                    <span
                      className="
                        text-gray-400 transition-transform
                        group-hover:translate-x-1 group-hover:text-gray-600
                      "
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                </Link>
                <Link
                  href="/calculator/insurance-value"
                  className="
                    group relative rounded-xl border border-gray-200
                    bg-white p-5
                    transition
                    hover:bg-gray-50
                    hover:border-gray-300
                    hover:shadow-sm
                  "
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🛡️</span>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 leading-tight">
                        보험 현금 가치 계산기
                      </h3>

                      <p className="mt-1 text-sm leading-relaxed text-gray-500">
                        보험을 유지할지, 해지 후 투자할지 비교합니다.
                        보장금과 투자 결과를 미래 금액과 지금 기준 가치로 함께 계산합니다.
                      </p>
                    </div>

                    <span
                      className="
                        text-gray-400 transition-transform
                        group-hover:translate-x-1 group-hover:text-gray-600
                      "
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                </Link>
              </div>
            </section>

            <section
              className="
                rounded-2xl
                bg-white
                bg-gradient-to-r from-gray-50 to-white
              "
            >
              <h2 className="text-lg font-semibold text-gray-900">
                주요 경제 이벤트로 읽는 경제의 흐름
              </h2>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  경제 이벤트 발생 이후, 위에서 살펴본 주요 지표들이 어떻게 반응했는지 확인할 수 있습니다.
              </p>
              <div className="mt-6">
                <EconomicTimeline />
              </div>
            </section>
          </main>
        </div>
      </section>
  );
}
