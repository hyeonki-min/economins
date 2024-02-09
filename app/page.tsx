import styles from '@/app/ui/home.module.css';
import createPresignedUrl from '@/app/lib/economins';

import EconominsLogo from '@/app/ui/logo';
import Category from '@/app/ui/category';
import { Indicator } from '@/app/lib/definitions';
import { notFound } from 'next/navigation';

export const revalidate = 1

export default async function Page() {
  
  const allElement = await createPresignedUrl({ key: 'main/main' });
  if (allElement.length < 1) {
    notFound();
  }
  return (
    <main className="flex-col bg-slate-50">
      <div className="flex sticky top-0 h-12 shrink-0 items-end p-2 md:h-12">
        <EconominsLogo />
      </div>
      <div className="min-h-screen">
        <div className="m-0 m-auto grid max-w-screen-2xl pt-4">
          <Category elements={allElement}></Category>
        </div>
      </div>
    </main>
  );
}
