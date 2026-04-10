import { fetchDataset } from '@/app/lib/fetch-data';

import Category from '@/app/ui/category';
import { Indicator } from '@/app/lib/definitions';
import { notFound } from 'next/navigation';

export const revalidate = 1

export default async function Page() {
  
  const allElement = await fetchDataset<Indicator>(`main/main`);
  
  if (allElement.length < 1) {
    notFound();
  }
  return (
    <>
      <section className="mt-8">
        <h1 className="text-xl md:text-2xl font-semibold">
          경제 지표를 선택하고 시장 흐름을 확인하세요
        </h1>

        <div className="mt-6">
          <Category elements={allElement} />
        </div>
      </section>
    </>
  );
}
