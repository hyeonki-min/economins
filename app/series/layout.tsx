import EconominsLogo from '@/app/ui/logo';
import Link from 'next/link';


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex-col bg-slate-50">
      <div className="flex h-12 shrink-0 items-end p-2 md:h-12">
        <EconominsLogo />
      </div>
      <div className="m-0 m-auto max-w-screen-2xl">
        {children}
      </div>
    </div>
  );
}