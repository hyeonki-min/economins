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
    <Category elements={allElement}></Category>
  );
}
