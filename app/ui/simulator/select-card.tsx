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
                rounded-lg border p-3 text-left transition
                ${selected
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                  : "border-slate-300 hover:bg-slate-100"}
              `}
            >

            <div className="mt-1 text-base font-semibold text-slate-800">
              {opt.label}
            </div>

            {opt.value && (
              <div className="mt-2 text-xs text-slate-400 group-hover:text-slate-500">
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
