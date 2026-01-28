export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-74px)] flex-col">
      <div className="m-0 m-auto max-w-screen-2xl flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}