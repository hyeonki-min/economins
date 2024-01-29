import styles from '@/app/ui/home.module.css';
import createPresignedUrl from '@/app/lib/economins';

import EconominsLogo from '@/app/ui/logo';
import Category from '@/app/ui/category';


export interface Element {
  name: string,
  type: string,
  source: string,
  id: string
}

export default async function Page() {
  const allElement: Element[] = await createPresignedUrl({ key: 'main/main' });

  return (
    <main className="min-h-screen flex-col bg-slate-50">
      <div className="flex h-12 shrink-0 items-end p-2 md:h-12">
        <EconominsLogo />
      </div>
      <div className="m-0 m-auto grid max-w-screen-2xl pt-4">
        <Category elements={allElement}></Category>
      </div>
    </main>
  );
}
