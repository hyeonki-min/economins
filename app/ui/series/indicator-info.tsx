import type { IndicatorInfo } from '@/app/lib/definitions';
import { fetchDataset } from '@/app/lib/fetch-data';

export default async function IndicatorInfo({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const indicators = await fetchDataset<IndicatorInfo>(`info/${id}`);
  return (
    <div className="py-28 fade-in-animation">
      <div className="py-8">
        <div className="w-full">
          <div className="pb-8">
            <h2 className="text-5xl">{name} 조금 더 잘 이해하기.</h2>
          </div>
        </div>
        <div className="md:px-28">
          {indicators.length < 1 ? (
            <div>There are no detail info.</div>
          ) : (
            indicators.map((indicator) => (
              <div key={indicator.keyword}>
                <h1 className="text-2xl">{indicator.keyword}</h1>
                <div className="pb-10 font-normal leading-6">
                  {indicator.description}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
