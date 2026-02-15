import LineChart from '@/app/ui/series/line-chart';

import { fetchDataset, fetchObject } from '@/app/lib/fetch-data';
import { Indicator, XYPoint } from '@/app/lib/definitions';
import SearchModal from '@/app/ui/series/search-modal';
import SearchResult from '@/app/ui/series/search-result';
import { notFound } from 'next/navigation';
import Carousel from '@/app/ui/carousel';
import { events } from '@/app/lib/data/events';
import { Metadata } from 'next';
import { seoMetaMap } from '@/app/lib/seo-meta';
import { EventMeta, RouteProps } from '@/app/lib/definitions';
import { adjustDateRangeByEvent, DateRangeSchema, findEvent } from '@/app/lib/utils';


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

export async function generateMetadata({ params, searchParams }: RouteProps): Promise<Metadata> {
  const { id, compareId } = await params;
  const resolvedSearchParams = await searchParams;

  const baseMeta = seoMetaMap[id];
  const compareMeta = seoMetaMap[compareId];

  if (!baseMeta || !compareMeta) {
    return {
      title: '경제 지표 시각화 - economins',
      description: '기준금리, 아파트 실거래가 등 경제 데이터를 시각적으로 비교해보는 플랫폼',
    };
  }

  const eventId = resolvedSearchParams.event as string | undefined;
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

export default async function Page({ params, searchParams }: RouteProps) {
  const { id, compareId } = await params;
  const resolvedSearchParams = await searchParams;

  const [firstIndicator, firstData, secondIndicator, secondData] = await Promise.all([
    fetchObject<Indicator>(`indicator/${id}`),
    fetchDataset<XYPoint>(`data/${id}`),
    fetchObject<Indicator>(`indicator/${compareId}`),
    fetchDataset<XYPoint>(`data/${compareId}`),
  ]);

  if (!firstIndicator) {
    notFound();
  }

  let dateRange = DateRangeSchema.parse(resolvedSearchParams);

  const finalEvent = findEvent(
    events,
    resolvedSearchParams.event
  );

  dateRange = adjustDateRangeByEvent(
    dateRange,
    finalEvent?.date
  );

  return (
    <>
      <SearchModal firstIndicator={firstIndicator} secondIndicator={secondIndicator ?? undefined}>
        <SearchResult id={id}></SearchResult>
      </SearchModal>
      <div className="md:py-6">
        <div className="flex flex-col">
          <LineChart data={firstData} indicator={firstIndicator} data2={secondData} indicator2={secondIndicator ?? undefined} event={finalEvent} dateRange={dateRange}/>
        </div>
      </div>
      <div className="mt-2">
        <Carousel seriesA={firstData} seriesB={secondData} indicatorA={firstIndicator} indicatorB={secondIndicator} event={finalEvent}/>
      </div>
    </>
  );
}
