import LineChart from '@/app/ui/series/line-chart';

import createPresignedUrl from '@/app/lib/economins';
import SearchModal from '@/app/ui/series/search-modal';
import SearchResult from '@/app/ui/series/search-result';
import { notFound } from 'next/navigation';
import Carousel from '@/app/ui/carousel';
import { events } from '@/app/lib/events';
import { Metadata } from 'next';
import { seoMetaMap } from '@/app/lib/seoMeta';

type Props = {
  params: { id: string, compareId: string},
  searchParams: { [key: string]: string | string[] | undefined };
};

type EventMeta = {
  id: string;
  name: string;
  date: string;
};

const getEventMeta = (eventId?: string): EventMeta | null => {
  if (!eventId) return null;
  return events.find((event) => event.id === eventId) ?? null;
};

const buildTitle = (base: string, compare: string, eventName?: string | null) =>
  eventName ? `${base} vs ${compare} - ${eventName}` : `${base} vs ${compare}`;

const buildDescription = (base: string, compare: string, eventName?: string | null) =>
  eventName
    ? `${eventName} 전후 ${base}, ${compare} 데이터를 비교해보세요.`
    : `${base}, ${compare} 데이터를 한눈에 비교해보세요.`;

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id, compareId } = params;

  const baseMeta = seoMetaMap[id];
  const compareMeta = seoMetaMap[compareId];

  if (!baseMeta || !compareMeta) {
    return {
      title: '경제 지표 시각화 - economins',
      description: '기준금리, 아파트 실거래가 등 경제 데이터를 시각적으로 비교해보는 플랫폼',
    };
  }

  const eventId = searchParams.event as string | undefined;
  const eventMeta = getEventMeta(eventId);

  const title = buildTitle(baseMeta.title, compareMeta.title, eventMeta?.name);
  const description = buildDescription(baseMeta.title, compareMeta.title, eventMeta?.name);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

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
