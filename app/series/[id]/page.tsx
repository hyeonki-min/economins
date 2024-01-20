import MyChart from '@/app/ui/my-chart';

import createPresignedUrl from '@/app/lib/economins';
import Candidate from '@/app/ui/series/candidates';

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
        <div className="flex flex-col md:w-4/5">
          <MyChart data={data} indicator={indicator}></MyChart>
        </div>
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-1/5">
          <Candidate></Candidate>
        </div>
      </div>
    </>
  );
}
