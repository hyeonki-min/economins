import createPresignedUrl from '@/app/lib/economins';

import EconominsLogo from '@/app/ui/logo';
import Category from '@/app/ui/category';
import { Indicator } from '@/app/lib/definitions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { nanumsquare } from '@/app/ui/fonts';
import dynamic from 'next/dynamic';


const EconomicTimeline = dynamic(() => import('@/app/ui/timeline'), { ssr: false });

export default async function Page() {
  const allElement: Indicator[] = await createPresignedUrl({ key: 'main/main' });
  if (allElement.length < 1) {
    notFound();
  }

  return (
    <main className="flex-col bg-slate-50">
      <div className="flex sticky top-0 h-12 shrink-0 items-end p-2 md:h-12">
        <EconominsLogo />
      </div>
      <div className={`${nanumsquare.className} min-h-screen`}>
        <div className="m-0 m-auto max-w-screen-xl">
          <Category elements={allElement}></Category>
          <div className="mt-10"></div>
          <EconomicTimeline />
          <div className="mt-10">
            <Link
              href={'/indicators/'}
            >
              <h4 className={'${nanumsquare.className} door'}>경제 지표 보러 가기</h4>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
