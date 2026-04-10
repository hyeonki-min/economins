'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { Indicator } from '@/app/lib/definitions';


export default function Category({ elements }: { elements: Indicator[] }) {
  const [types, setTypes] = useState<string>('all');
  const allTypes = useMemo(() => {
    const set = new Set<string>()
    set.add('all')

    elements.forEach((el) => {
      set.add(el.type)
    })

    return Array.from(set)
  }, [elements])
  return (
    <div className="grid gap-2 md:grid-cols-4 md:gap-4 text-slate-700">

      {/* -------- Filter Chips (Scroll on mobile) -------- */}
      <div className="md:col-span-4 flex gap-2 overflow-x-auto whitespace-nowrap px-1 pb-2">
        {allTypes.map((type) => (
          <label
            htmlFor={type}
            key={type}
            className={clsx(
              `
              flex-shrink-0 cursor-pointer rounded-full border px-3 py-1 text-sm
              bg-slate-100 text-slate-700
              truncate max-w-[120px]
              hover:bg-slate-200 transition select-none
              peer-checked:bg-neutral-900 peer-checked:text-white
            `,
              {
                'bg-slate-900 text-white hover:bg-neutral-900': type === types,
              },
            )}
          >
            {type}
            <input
              name="data-type"
              id={type}
              value={type}
              type="radio"
              className="hidden"
              onChange={(e) => setTypes(e.target.value)}
              checked={type === types}
            />
          </label>
        ))}
      </div>

      {/* -------- Elements Grid -------- */}
      {elements.map((el) => (
        <Link
          key={el.name}
          href={'/series/' + el.id}
          className={clsx(
            `
            group rounded-xl border border-slate-200
            bg-white p-4
            transition
            hover:border-slate-300
            hover:bg-slate-50
            hover:shadow-sm
            hover:-translate-y-[1px]
          `,
            { hidden: types !== 'all' ? el.type !== types : false }
          )}
        >
          <h4 className="font-semibold text-slate-900">
            {el.name}
          </h4>

          <p className="mt-1 text-xs text-slate-500">
            {el.source}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {el.type}
          </p>
        </Link>
      ))}

    </div>
  );
}
