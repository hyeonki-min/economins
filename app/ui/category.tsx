'use client';

import { useState } from 'react';
import clsx from 'clsx';

export default function Category() {
  const allTypes: string[] = ['전체', '금리', '아파트실거래가'];

  const [types, setTypes] = useState<string>('전체');

  return (
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
  );
}
