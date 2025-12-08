'use client';

import { useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { Indicator } from '@/app/lib/definitions';


export default function Category({ elements }: { elements: Indicator[] }) {
  const [types, setTypes] = useState<string>('all');
  let cType = new Map([['all', '']]);
  elements.map((el) => {
    cType.set(el.type, '');
  });
  const allTypes = Array.from(cType.keys());
  return (
    <div className="grid gap-2 md:grid-cols-4 md:gap-4 text-slate-700">

      {/* -------- Filter Chips (Scroll on mobile) -------- */}
      <div className="md:col-span-4 flex gap-2 overflow-x-auto whitespace-nowrap px-1 pb-1 no-scrollbar">
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
                'bg-neutral-900 text-white': type === types,
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
            group grid grid-rows-[32px_1fr_auto] rounded-lg border border-slate-300 
            p-4 text-slate-700 ring-1 ring-transparent hover:bg-slate-200 transition
          `,
            {
              hidden: types !== 'all' ? el.type !== types : false,
            },
          )}
        >
          <h4 className="font-semibold">{el.name}</h4>
          <p className="text-xs text-slate-500">{el.source}</p>
        </Link>
      ))}

    </div>
  );
}
