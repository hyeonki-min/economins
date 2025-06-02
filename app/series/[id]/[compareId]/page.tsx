import LineChart from '@/app/ui/series/line-chart';

import createPresignedUrl from '@/app/lib/economins';
import SearchModal from '@/app/ui/series/search-modal';
import SearchResult from '@/app/ui/series/search-result';
import { notFound } from 'next/navigation';
import Carousel from '@/app/ui/carousel';
import { events } from '@/app/lib/events';

type Props = {
  params: { id: string, compareId: string},
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ params, searchParams }: Props) {
  const id = params.id;
  const compareId = params.compareId;
  const [mainIndicator, mainData, compareIndicator, compareData] = await Promise.all([
    createPresignedUrl({ key: 'indicator/'+id }),
    createPresignedUrl({ key: 'data/'+id }),
    createPresignedUrl({ key: 'indicator/'+compareId }),
    createPresignedUrl({ key: 'data/'+compareId }),  
  ]);
  if (mainIndicator.length < 1 || compareIndicator.length < 1) {
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
      <SearchModal firstTitle={mainIndicator.name} secondTitle={compareIndicator.name}>
        <SearchResult id={id}></SearchResult>
      </SearchModal>
      <div className="md:py-6">
        <div className="flex flex-col">
          <LineChart data={mainData} indicator={mainIndicator} data2={compareData} indicator2={compareIndicator} eventTime={finalEvent.date} eventTitle={finalEvent.name}/>
        </div>
      </div>
      <div className="">
        <Carousel target={finalEvent.id}/>
      </div>
    </>
  );
}
