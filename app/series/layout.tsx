import EconominsLogo from '@/app/ui/logo';


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex-col">
      <div className="flex sticky top-0 h-12 shrink-0 items-end p-2 md:h-12">
        <EconominsLogo />
      </div>
      <div className="m-0 m-auto max-w-screen-2xl">
        {children}
      </div>
    </div>
  );
}