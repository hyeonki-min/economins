import LineChart from '@/app/ui/line-chart';

import createPresignedUrl from '@/app/lib/economins';
import Candidate from '@/app/ui/series/candidates';

export default async function Page({ params }: { params: { id: string, compareId: string } }) {
  const id = params.id;
  const compareId = params.compareId;
  const [mainIndicator, mainData, compareIndicator, compareData] = await Promise.all([
    createPresignedUrl({
      bucket: 'economins',
      key: 'indicator/'+id,
    }),
    createPresignedUrl({ bucket: 'economins', key: 'data/'+id }),
    createPresignedUrl({
        bucket: 'economins',
        key: 'indicator/'+compareId,
      }),
      createPresignedUrl({ bucket: 'economins', key: 'data/'+compareId }),  
  ]);
  return (
    <>
      <h1>{mainIndicator.name} + {compareIndicator.name}</h1>
      <div className="flex gap-4 md:flex-row md:py-6">
        <div className="flex flex-col">
          <LineChart data={mainData} indicator={mainIndicator} data2={compareData} indicator2={compareIndicator}>
          </LineChart>
        </div>
        {/* <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-1/5">
          <Candidate></Candidate>
        </div> */}
      </div>
    </>
  );
}
