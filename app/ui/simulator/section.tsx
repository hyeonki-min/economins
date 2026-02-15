export function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-xl font-bold">
          {title}
        </h2>
        <p className="text-slate-600">
          {description}
        </p>
      </header>
      {children}
    </section>
  )
}