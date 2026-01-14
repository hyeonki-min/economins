import { Indicator } from "@/app/lib/definitions";
import { buildYearsFromInitDates, isDisabled } from "@/app/lib/utils";


export function YearMonthPicker({
  year,
  month,
  onSelect,
  indicatorA,
  indicatorB,
}: {
  year: number;
  month: number;
  onSelect: (y: number, m: number) => void;
  indicatorA: Indicator;
  indicatorB?: Indicator;
}) {
  const years = buildYearsFromInitDates(indicatorA.initDate, indicatorB?.initDate);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="
        w-64 max-w-[90vw]
        rounded-xl border border-slate-200
        bg-white p-4 shadow-xl
    ">
      <div className="grid grid-cols-4 gap-2 mb-3">
        {years.map((y) => (
          <button
            key={y}
            className={`
              rounded px-2 py-1 text-sm
              ${y === year ? "bg-indigo-600 text-white" : "hover:bg-gray-100"}
            `}
            onClick={() => onSelect(y, month)}
          >
            {y}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {months.map((m) => {
          const disabled = isDisabled(year, m, indicatorA, indicatorB);
          return (
          <button
            key={m}
            disabled={disabled}
            className={`
                rounded-md px-2 py-1 text-sm font-medium
                transition-colors duration-150
                ${
                disabled
                    ? "text-slate-300 border border-dashed border-slate-300 cursor-not-allowed"
                    : m === month
                    ? "bg-indigo-600 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }
            `}
            onClick={() => !disabled && onSelect(year, m)}
          >
            {String(m).padStart(2, "0")}
          </button>
        )
      })}
      </div>
    </div>
  );
}
