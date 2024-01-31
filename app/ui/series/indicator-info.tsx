import { IndicatorInfo } from '@/app/lib/definitions';
import createPresignedUrl from '@/app/lib/economins';

export default async function IndicatorInfo({ id, name }: { id: string, name: string }) {
  const indicators: IndicatorInfo[] = await createPresignedUrl({
    key: 'info/' + id,
  });
  return (
    <div className="py-28">
      <div className="py-28">
        <div className="w-full">
          <div className="pb-28">
            <h2 className="text-5xl">{name} 조금 더 잘 이해하기.</h2>
          </div>
        </div>
        <div className="px-28">
          {indicators.length < 1? (<div>There is no detail info.</div>) : indicators.map((indicator) => (
            <>
              <h1 className="text-2xl">{indicator.keyword}</h1>
              <div>{indicator.description}</div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
