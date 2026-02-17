type SelectOption<T> = {
  label: string
  value: T
  description?: string
}

type SelectCardProps<T> = {
  title: string
  value: T
  options: SelectOption<T>[]
  onChange: (v: T) => void
}

export function SelectCard<T>({
  title,
  value,
  options,
  onChange,
}: SelectCardProps<T>) {
  const values = options.find(o => o.value === value)
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-slate-500">
        {title}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {options.map(opt => {
          const selected = opt.value === value
          return (
            <button
              key={String(opt.value)}
              onClick={() => onChange(opt.value)}
              className={`
                rounded-xl border p-3 text-left transition-all duration-150
                ${selected
                  ? "border-2 border-blue-500 text-slate-900"
                  : "border border-slate-300 text-slate-600 hover:border-slate-400"
                }
              `}
            >

            <div className="mt-1 text-base font-semibold">
              {opt.label}
            </div>

            {opt.value && (
              <div className="mt-2 text-xs group-hover:text-slate-500">
                {opt.description}
              </div>
            )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
