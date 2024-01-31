import { Report } from '@/app/lib/definitions';
import createPresignedUrl from '@/app/lib/economins';

import { BookOpenIcon, LinkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';


export default async function RelatedReports({ id }: { id: string }) {
  const relatedReports: Report[] = await createPresignedUrl({
    key: 'info/' + id,
  });
  return (
    <div className="py-28">
      <div className="w-full py-28">
        <div className="pb-28">
          <h2 className="text-5xl">관련 리포트.</h2>
        </div>
      </div>
      <div className="grid grid-flow-row grid-cols-4 gap-8">
        {relatedReports.length < 1? (<div>There is no related reports.</div>) : relatedReports.map((report) => (
          <div className="max-h-52 rounded-3xl border-solid bg-slate-200 p-12">
            <h3 className="text-2xl">{report.title}</h3>
            <div className="my-3">
              <p className="font-normal leading-6">{report.description}</p>
            </div>
            <Link className="flex" href={report.sourceUrl}>
              <LinkIcon className="w-5 text-gray-400"></LinkIcon>
              {report.source}
            </Link>
            <div className="flex justify-end">
              <BookOpenIcon className="w-10 text-gray-400"></BookOpenIcon>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
