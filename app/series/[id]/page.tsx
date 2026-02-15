import LineChart from '@/app/ui/series/line-chart';

import { fetchDataset, fetchObject } from '@/app/lib/fetch-data';
import { Indicator, XYPoint } from '@/app/lib/definitions';
import SearchModal from '@/app/ui/series/search-modal';
import SearchResult from '@/app/ui/series/search-result';
import { notFound } from 'next/navigation';
import RelatedReports from '@/app/ui/series/related-reports';
import IndicatorInfo from '@/app/ui/series/indicator-info';
import { events } from '@/app/lib/data/events';
import { seoMetaMap } from '@/app/lib/seo-meta';
import Carousel from '@/app/ui/carousel';
import { Metadata } from 'next';
import { Events, RouteProps } from '@/app/lib/definitions';
import { adjustDateRangeByEvent, DateRangeSchema, findEvent } from '@/app/lib/utils';


const getEventMeta = (eventId?: string): Events | null => {
  if (!eventId) return null;
  return events.find((event) => event.id === eventId) ?? null;
};

const buildTitle = (base: string, eventName?: string | null) =>
  eventName ? `${base} - ${eventName}` : `${base}`;

const buildDescription = (base: string, eventName?: string | null) =>
  eventName
    ? `${eventName} 전후 ${base}`
    : `${base}`;

export async function generateMetadata({ params, searchParams }: RouteProps): Promise<Metadata> {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const baseMeta = seoMetaMap[id];

  if (!baseMeta) {
    return {
      title: '경제 흐름을 한눈에 보는 경제 지표 시각화 플랫폼',
      description:
        '기준금리·물가·환율·주택가격 등 주요 경제 지표를 시각적으로 비교해 지금의 경제 흐름을 한눈에 파악하세요.',
    };
  }

  const eventId = resolvedSearchParams.event as string | undefined;
  const eventMeta = getEventMeta(eventId);

  const title = buildTitle(baseMeta.title, eventMeta?.name);
  const description = buildDescription(
    baseMeta.description,
    eventMeta?.name
  );
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
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const [indicator, data] = await Promise.all([
    fetchObject<Indicator>(`indicator/${id}`),
    fetchDataset<XYPoint>(`data/${id}`),
  ]);

  if (!indicator) {
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
    <div className="mt-2">
      <SearchModal firstIndicator={indicator} secondIndicator={undefined}>
        <SearchResult id={id}/>
      </SearchModal>
      <div className="md:py-6">
        <div className="flex flex-col">
          <LineChart
            data={data}
            indicator={indicator}
            data2={[]}
            indicator2={undefined}
            dateRange={dateRange}
            event={finalEvent}
          />
        </div>
      </div>
      <div className="mt-2">
        <Carousel seriesA={data} indicatorA={indicator} event={finalEvent}/>
      </div>
      <RelatedReports id={id}></RelatedReports>
      <IndicatorInfo id={id} name={indicator.name}></IndicatorInfo>
    </div>
  );
}
