import styles from '@/app/ui/home.module.css';
import createPresignedUrl from '@/app/lib/economins';

import EconominsLogo from '@/app/ui/logo';
import Category from '@/app/ui/category';
import Link from 'next/link';
import clsx from 'clsx';


export interface Element {
  name: string,
  type: string,
  source: string,
  id: string
}

export default async function Page() {
  const allElement: Element[] = await createPresignedUrl({ bucket: 'economins', key: 'main/main' });

  return (
    <main className="min-h-screen flex-col bg-slate-50">
      <div className="flex h-12 shrink-0 items-end p-2 md:h-12">
        <EconominsLogo />
      </div>
      <div className="m-0 m-auto grid max-w-screen-2xl">
        <div className="grid grid-flow-row grid-cols-4 gap-4 text-slate-700">
          <Category></Category>
          {
            allElement.map((el)=>(
              <Link 
              key={el.name}
              href={'/series/'+el.id}
              className={clsx(
                'text-slate-700 group grid grid-rows-[32px_1fr_auto] items-center p-4 ring-1 ring-transparent rounded-lg border border-slate-300 hover:bg-slate-200',
                // {
                //   'hidden': types !== "전체"? el.type !== types: false,
                // }
              )}
              >
              <h4>{el.name}</h4>
              <p className="text-xs">{el.source}</p>
              </Link>
            ))
          }
        </div>
      </div>
    </main>
  );
}
