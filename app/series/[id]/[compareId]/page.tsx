import LineChart from '@/app/ui/line-chart';

import createPresignedUrl from '@/app/lib/economins';
import SearchModal from '@/app/ui/series/search-modal';
import SearchResult from '@/app/ui/series/search-result';
import { notFound } from 'next/navigation';


export default async function Page({ params }: { params: { id: string, compareId: string } }) {
  const id = params.id;
  const compareId = params.compareId;
  const [mainIndicator, mainData, compareIndicator, compareData] = await Promise.all([
    createPresignedUrl({ key: 'indicator/'+id }),
    createPresignedUrl({ key: 'data/'+id }),
    createPresignedUrl({ key: 'indicator/'+compareId }),
    createPresignedUrl({ key: 'data/'+compareId }),  
  ]);
  if (!mainIndicator || !compareIndicator) {
    notFound();
  }
  return (
    <>
      <SearchModal firstTitle={mainIndicator.name} secondTitle={compareIndicator.name}>
        <SearchResult id={id}></SearchResult>
      </SearchModal>
      <div className="flex gap-4 md:flex-row md:py-6">
        <div className="flex flex-col">
          <LineChart data={mainData} indicator={mainIndicator} data2={compareData} indicator2={compareIndicator}>
          </LineChart>
        </div>
      </div>
    </>
  );
}
