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
      <h1 className="text-xl md:text-2xl font-semibold mt-3 mb-3">
        관심 있는 경제 지표를 골라보세요.
      </h1>
      <Category elements={allElement}></Category>
    </>
  );
}
