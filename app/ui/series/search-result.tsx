import Link from 'next/link';
import clsx from 'clsx';
import createPresignedUrl from '@/app/lib/economins';


export interface Element {
  name: string,
  type: string,
  source: string,
  id: string
}

export default async function SearchResult({id}: {id: string}) {
  const allElement: Element[] = await createPresignedUrl({ key: 'main/main' });
  
  return (
    <div className="mt-4 space-y-2">
      {allElement.map((el) => (
        <Link
          key={el.name}
          href={id===el.id?'/series/'+id:'/series/'+id+'/'+el.id}
          className={clsx(
            'group grid items-center rounded-lg border border-slate-300 p-4 text-slate-700 ring-1 ring-transparent hover:bg-slate-200',
            // {
            //   'hidden': types !== "전체"? el.type !== types: false,
            // }
          )}
        >
          <h4>{el.name}</h4>
        </Link>
      ))}
    </div>
  );
}
