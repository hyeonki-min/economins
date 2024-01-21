import LineChart from '@/app/ui/line-chart';

import createPresignedUrl from '@/app/lib/economins';
import SearchModal from '@/app/ui/series/search-modal';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [indicator, data] = await Promise.all([
    createPresignedUrl({
      bucket: 'economins',
      key: 'indicator/'+id,
    }),
    createPresignedUrl({ bucket: 'economins', key: 'data/'+id }),
  ]);
  return (
    <>
      <h1>{indicator.name}</h1>
      <div className="flex gap-4 md:flex-row md:py-6">
        <div className="flex flex-col">
          <LineChart data={data} indicator={indicator} data2={[]} indicator2={[]}>
          </LineChart>
        </div>
      </div>
      <SearchModal></SearchModal>
    </>
  );
}
