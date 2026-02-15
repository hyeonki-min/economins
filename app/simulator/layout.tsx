export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-74px)] flex-col">
      <div className="m-auto max-w-screen-xl flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}