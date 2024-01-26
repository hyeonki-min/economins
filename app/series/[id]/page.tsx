import LineChart from '@/app/ui/line-chart';

import createPresignedUrl from '@/app/lib/economins';
import SearchModal from '@/app/ui/series/search-modal';
import { notFound } from 'next/navigation';
import SearchResult from '@/app/ui/series/search-result';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [indicator, data] = await Promise.all([
    createPresignedUrl({ key: 'indicator/'+id }),
    createPresignedUrl({ key: 'data/'+id }),
  ]);
  if (!indicator) {
    notFound();
  }
  return (
    <>
      <SearchModal name={indicator.name}>
        <SearchResult id={id}></SearchResult>
      </SearchModal>
      <div className="flex gap-4 md:flex-row md:py-6">
        <div className="flex flex-col">
          <LineChart data={data} indicator={indicator} data2={[]} indicator2={[]}>
          </LineChart>
        </div>
      </div>
    </>
  );
}
