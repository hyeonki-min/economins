"use client";

interface PeriodShortcutProps {
  periods?: number[];
  onSelect: (years: number) => void;
  activePeriod?: number;
}

export function PeriodShortcut({
  periods = [3, 5, 10],
  onSelect,
  activePeriod,
}: PeriodShortcutProps) {
  return (
    <>
      {periods.map((p) => {
        const isActive = activePeriod === p;

        return (
          <button
            key={p}
            type="button"
            onClick={() => onSelect(p)}
            className={`
              px-3 py-1 rounded-md border text-sm
              transition-colors duration-150
              ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600"
                  : "text-slate-700 border-slate-300 hover:bg-blue-50 hover:border-blue-400"
              }
            `}
          >
            {p}Y
          </button>
        );
      })}
    </>
  );
}
