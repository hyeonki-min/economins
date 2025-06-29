import LineChart from '@/app/ui/series/line-chart';

import createPresignedUrl from '@/app/lib/economins';
import SearchModal from '@/app/ui/series/search-modal';
import SearchResult from '@/app/ui/series/search-result';
import { notFound } from 'next/navigation';
import RelatedReports from '@/app/ui/series/related-reports';
import IndicatorInfo from '@/app/ui/series/indicator-info';
import { events } from '@/app/lib/events';
import { seoMetaMap } from '@/app/lib/seoMeta';
import Carousel from '@/app/ui/carousel';
import { Metadata } from 'next';

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

const buildTitle = (base: string, eventName?: string | null) =>
  eventName ? `${base} - ${eventName}` : `${base}`;

const buildDescription = (base: string, eventName?: string | null) =>
  eventName
    ? `${eventName} 전후 ${base}`
    : `${base}`;

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
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
