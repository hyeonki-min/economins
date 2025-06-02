import LineChart from '@/app/ui/series/line-chart';

import createPresignedUrl from '@/app/lib/economins';
import SearchModal from '@/app/ui/series/search-modal';
import SearchResult from '@/app/ui/series/search-result';
import { notFound } from 'next/navigation';
import RelatedReports from '@/app/ui/series/related-reports';
import IndicatorInfo from '@/app/ui/series/indicator-info';
import { events } from '@/app/lib/events';
import Carousel from '@/app/ui/carousel';

type Props = {
  params: { id: string, compareId: string},
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ params, searchParams }: Props) {
  const id = params.id;
  const [indicator, data] = await Promise.all([
    createPresignedUrl({ key: 'indicator/' + id }),
    createPresignedUrl({ key: 'data/' + id }),
  ]);
  if (indicator.length < 1) {
    notFound();
  }

  const target = searchParams.event; 

  const finalEvent = events.find((event : any) => event.id === target) ?? {
    id: null,
    name: null,
    date: null
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
            eventTime={finalEvent.date} eventTitle={finalEvent.name}
          />
        </div>
      </div>
      <div className="">
        <Carousel target={finalEvent.id}/>
      </div>
      <RelatedReports id={id}></RelatedReports>
      <IndicatorInfo id={id} name={indicator.name}></IndicatorInfo>
    </>
  );
}
