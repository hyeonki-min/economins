import AcmeLogo from '@/app/ui/acme-logo';
import Link from 'next/link';


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex-col bg-slate-50">
      <div className="flex h-12 shrink-0 items-end bg-blue-500 p-2 md:h-12">
        <AcmeLogo />
        <Link
            href="/about"
            className="flex items-center gap-5 self-start bg-blue-500 px-6 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
          <span>About</span>
        </Link>
      </div>
      <div className="m-0 m-auto flex max-w-screen-2xl gap-4 md:flex-row">
        {children}
      </div>
    </div>
  );
}