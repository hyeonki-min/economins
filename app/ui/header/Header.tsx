import EconominsLogo from './logo';

export default function Header() {
  return (
    <header className="
      sticky top-0 z-50
      backdrop-blur
      border-b border-slate-200
    ">
      <div className="
        mx-auto flex h-10 max-w-screen-2xl
        items-center
        px-4 sm:px-6 lg:px-8
      ">
        <EconominsLogo />
      </div>
    </header>
  );
}
