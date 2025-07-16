import LineChart from '@/app/ui/series/line-chart';

import createPresignedUrl from '@/app/lib/economins';
import SearchModal from '@/app/ui/series/search-modal';
import SearchResult from '@/app/ui/series/search-result';
import { notFound } from 'next/navigation';
import RelatedReports from '@/app/ui/series/related-reports';
import IndicatorInfo from '@/app/ui/series/indicator-info';
import { events } from '@/app/lib/events';
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
  const { id } = params;

  const baseMeta = seoMetaMap[id];

  if (!baseMeta) {
    return {
      title: '경제 지표 시각화 - economins',
      description: '기준금리, 아파트 실거래가 등 경제 데이터를 시각적으로 비교해보는 플랫폼',
    };
  }

  const eventId = searchParams.event as string | undefined;
  const eventMeta = getEventMeta(eventId);

  const title = buildTitle(baseMeta.title, eventMeta?.name);
  const description = buildDescription(baseMeta.description, eventMeta?.name);

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
  const id = params.id;
  const [indicator, data] = await Promise.all([
    createPresignedUrl({ key: 'indicator/' + id }),
    createPresignedUrl({ key: 'data/' + id }),
  ]);
  if (indicator.length < 1) {
    notFound();
  }
  let dateRange = DateRangeSchema.parse(searchParams);
  const finalEvent = findEvent(events, searchParams.event);
  dateRange = adjustDateRangeByEvent(dateRange, finalEvent?.date);

  return (
    <>
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
        <Carousel target={finalEvent?.id}/>
      </div>
      <RelatedReports id={id}></RelatedReports>
      <IndicatorInfo id={id} name={indicator.name}></IndicatorInfo>
    </>
  );
}
