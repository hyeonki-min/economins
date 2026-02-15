import { Indicator, PickerTarget } from "@/app/lib/definitions";
import { useClickOutside } from "@/app/lib/click-outside";
import { useCallback, useRef } from "react";
import { YearMonthPicker } from "./year-month-picker";


export function YearMonthInputGroup({
  target,
  openPicker,
  setOpenPicker,
  year,
  month,
  onSelect,
  idPrefix,
  indicatorA,
  indicatorB
}: {
  target: Exclude<PickerTarget, null>;
  openPicker: PickerTarget;
  setOpenPicker: React.Dispatch<
    React.SetStateAction<PickerTarget | null>
  >;
  year: number;
  month: number;
  onSelect: (y: number, m: number) => void;
  idPrefix: string;
  indicatorA: Indicator;
  indicatorB?: Indicator;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setOpenPicker(prev => (prev === target ? null : prev));
  }, [target]);

  useClickOutside(wrapperRef, handleClose);


  const isOpen = openPicker === target;

  return (
    <div ref={wrapperRef} className="relative">
      <div
        role="group"
        aria-labelledby={`${idPrefix}Label`}
        className="
          inline-flex items-center gap-1 rounded-lg border px-2 py-1
          cursor-pointer
          focus-within:ring-1 focus-within:ring-indigo-700
        "
        onClick={() => setOpenPicker(target)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpenPicker(target);
          if (e.key === "Escape") setOpenPicker(null);
        }}
      >
        <input
          type="text"
          id={`${idPrefix}Year`}
          className="w-14 border-none bg-transparent p-0 text-sm text-gray-900 focus:ring-0"
          value={year}
          readOnly
          aria-haspopup="dialog"
        />
        <input
          type="text"
          id={`${idPrefix}Month`}
          className="w-10 border-none bg-transparent p-0 text-sm text-gray-900 focus:ring-0"
          value={String(month).padStart(2, "0")}
          readOnly
          aria-haspopup="dialog"
        />
      </div>
      {isOpen && (
        <div className="
            fixed inset-0 z-40 bg-black/20
            sm:hidden
          "
          onClick={() => setOpenPicker(null)}
        />
      )}
      {isOpen && (
        <div className="
            z-50
            fixed inset-0 flex items-center justify-center
            sm:absolute sm:inset-auto sm:left-0 sm:block
            pointer-events-none
        ">
            <div className="pointer-events-auto">
                <YearMonthPicker
                    year={year}
                    month={month}
                    indicatorA={indicatorA}
                    indicatorB={indicatorB}
                    onSelect={(y, m) => {
                        onSelect(y, m);
                        setOpenPicker(null);
                    }}
                />
          </div>

        </div>
      )}
    </div>
  );
}