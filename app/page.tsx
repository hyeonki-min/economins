import { fetchDataset } from '@/app/lib/fetch-data';

import EconominsLogo from '@/app/ui/logo';
import Category from '@/app/ui/category';
import { Indicator } from '@/app/lib/definitions';
import Link from 'next/link';
import { pretendard } from '@/app/ui/fonts';
import dynamic from 'next/dynamic';
import PolicyCard from '@/app/ui/policy-card';

const EconomicTimeline = dynamic(() => import('@/app/ui/timeline'), {
  ssr: false,
});

export default async function Page() {
  const allElement = await fetchDataset<Indicator>(`main/main`);
  return (
    <main className="flex-col bg-slate-50">
      <div className="flex sticky top-0 h-12 shrink-0 items-end p-2 md:h-12">
        <EconominsLogo />
      </div>
      <div className={`${pretendard.className} min-h-screen`}>
        <div className="m-0 m-auto max-w-screen-xl">
          <PolicyCard></PolicyCard>
          {allElement && allElement.length > 0 ? (
            <Category elements={allElement} />
          ) : (
            <div className="text-center text-gray-500 py-10">표시할 카테고리 정보가 없습니다.</div>
          )}          
          <div className="mt-10"></div>
          <EconomicTimeline />
          <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow-md rounded-2xl border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
              📊 경제를 이해하기 위한 중요 지표
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li>
                <Link href={`/series/base-rate-korea`} className="flex items-start gap-2 hover:bg-blue-50 p-2 rounded-md transition-colors">
                  <span><strong>금리</strong> – 대내적인 돈의 가격</span>
                </Link>
              </li>
              <li>
                <Link href={`/series/exchange-rate-dollar-korea`} className="flex items-start gap-2 hover:bg-green-50 p-2 rounded-md transition-colors">
                  <span><strong>환율</strong> – 대외적인 돈의 가격</span>
                </Link>
              </li>
              <li>
                <Link href={`/series/real-gdp-korea`} className="flex items-start gap-2 hover:bg-yellow-50 p-2 rounded-md transition-colors">
                  <span><strong>국내총생산(GDP)</strong> – 소비+투자+정부지출+(수출-수입)</span>
                </Link>
              </li>
              <li>
                <Link href={`/series/cpi-korea`} className="flex items-start gap-2 hover:bg-red-50 p-2 rounded-md transition-colors">
                  <span><strong>물가상승률</strong> – 인플레이션</span>
                </Link>
              </li>
              <li>
                <Link href={`/series/unemployment-rate-korea`} className="flex items-start gap-2 hover:bg-purple-50 p-2 rounded-md transition-colors">
                  <span><strong>실업률</strong> – 안정적인 급여는 안정적인 소비가 가능</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
