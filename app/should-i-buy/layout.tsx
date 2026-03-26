export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex-col">
      <div className="m-0 m-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}