'use client';

import { useEffect, useState } from 'react';
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
    <div className="grid grid-flow-row grid-cols-4 gap-4 text-slate-700">
      <div className="col-span-4 flex gap-2">
        {allTypes.map((type) => (
          <label
            htmlFor={type}
            key={type}
            className={clsx(
              'has-[:checked]:text-slate-50 has-[:checked]:bg-neutral-950 cursor-pointer items-center rounded-lg border bg-slate-100 p-1 text-slate-700',
              {
                'hover:bg-slate-200': type != types,
              },
            )}
          >
            {type}
            <input
              name="data-type"
              id={type}
              value={type}
              type="radio"
              className="peer hidden"
              onChange={(e) => setTypes(e.target.value)}
              checked={type === types}
            ></input>
          </label>
        ))}
      </div>
      {elements.map((el) => (
        <Link
          key={el.name}
          href={'/series/' + el.id}
          className={clsx(
            'group grid grid-rows-[32px_1fr_auto] items-center rounded-lg border border-slate-300 p-4 text-slate-700 ring-1 ring-transparent hover:bg-slate-200',
            {
              hidden: types !== 'all' ? el.type !== types : false,
            },
          )}
        >
          <h4>{el.name}</h4>
          <p className="text-xs">{el.source}</p>
        </Link>
      ))}
    </div>
  );
}
