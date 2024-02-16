import LineChart from '@/app/ui/series/line-chart';

import createPresignedUrl from '@/app/lib/economins';
import SearchModal from '@/app/ui/series/search-modal';
import SearchResult from '@/app/ui/series/search-result';
import { notFound } from 'next/navigation';
import RelatedReports from '@/app/ui/series/related-reports';
import IndicatorInfo from '@/app/ui/series/indicator-info';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [indicator, data] = await Promise.all([
    createPresignedUrl({ key: 'indicator/' + id }),
    createPresignedUrl({ key: 'data/' + id }),
  ]);
  if (indicator.length < 1) {
    notFound();
  }
  return (
    <>
      <SearchModal firstTitle={indicator.name} secondTitle="">
        <SearchResult id={id}></SearchResult>
      </SearchModal>
      <div className="md:py-6">
        <div className="flex flex-col">
          <LineChart
            data={data}
            indicator={indicator}
            data2={[]}
            indicator2={[]}
          />
        </div>
      </div>
      <RelatedReports id={id}></RelatedReports>
      <IndicatorInfo id={id} name={indicator.name}></IndicatorInfo>
    </>
  );
}
