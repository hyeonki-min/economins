import EconominsLogo from '@/app/ui/logo';
import Link from 'next/link';
import { pretendard } from '@/app/ui/fonts';
import dynamic from 'next/dynamic';
import PolicyCard from '@/app/ui/monetary-policy/policy-card';
import Section from '@/app/ui/main/section';
import IndicatorCard from '@/app/ui/main/indicator-card';
import { loadIndicatorSections } from '@/app/lib/services/indicator.service';

const EconomicTimeline = dynamic(() => import('@/app/ui/timeline'), {
  ssr: false,
});

export default async function Page() {
  const sections = await loadIndicatorSections();

  return (
    <main className="flex-col bg-gray-50">
      <div className="flex sticky top-0 h-12 shrink-0 items-end p-2">
        <EconominsLogo />
      </div>
      <div className={`${pretendard.className} min-h-screen`}>
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-10">
           <header className="mb-8 space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              경제 지표로 이해하는 지금의 경제
            </h1>
            <p className="text-sm text-gray-600">
              주요 지표와 정책, 이벤트를 연결해
              지금 경제가 어떤 국면에 있는지 이해할 수 있도록 돕습니다.
            </p>
          </header>
          <PolicyCard></PolicyCard>

          <div>
            {sections
              .filter(s => s.id == "macro-core")
              .map(section => (
              <Section
                key={section.id}
                title={section.title}
                description={section.description}
              >
                {section.cards.map(card => (
                  <IndicatorCard
                    key={card.id}
                    title={card.title}
                    description={card.description}
                    indicators={card.indicators}
                    href={card.href}
                  />
                ))}
              </Section>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 sm:mt-12 md:mt-14">
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
                  <h3 className="font-semibold text-gray-900">
                    경제 흐름 이해하기
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    실물경제·금리·자산시장을 핵심 지표로 정리했습니다.
                  </p>
                </div>
                <span
                  className="
                    text-gray-400 transition-transform
                    group-hover:translate-x-1
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
                hover:bg-gray-100
                hover:border-gray-300
                hover:shadow-sm
              "
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">📊</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    경제 지표 전체 보기
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    모든 경제 지표를 한눈에 탐색하고 비교할 수 있습니다.
                  </p>
                </div>
                <span
                  className="
                    text-gray-400 transition-transform
                    group-hover:translate-x-1
                  "
                  aria-hidden
                >
                  →
                </span>
              </div>
            </Link>
          </div>

          <section
            className="
              mt-16
              rounded-2xl
              bg-white
              px-5 py-7
              border-l-4 border-blue-300
            "
          >
            <div className="mb-5 space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">
                주요 경제 이벤트로 읽는 경제의 흐름
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                경제 이벤트 발생 이후, 위에서 살펴본 주요 지표들이 어떻게 반응했는지 확인할 수 있습니다.
              </p>
            </div>

            <EconomicTimeline />
          </section>
        </div>
      </div>
    </main>
  );
}
