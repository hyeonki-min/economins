'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce';


export interface Element {
  name: string,
  type: string,
  source: string,
  id: string
}

export default function SearchResults({id, allElement}: {id: string, allElement: Element[]}) {
  const [keyword, setKeyword] = useState<string>('');
  const handleSearch = useDebouncedCallback((term) => {
    setKeyword(term);
  }, 300);

  return (
    <>
    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
            <RocketLaunchIcon
              className="h-6 w-6 text-blue-600"
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <div className="relative mb-3" data-te-input-wrapper-init>
              <input
                type="search"
                className="peer-focus:text-primary dark:peer-focus:text-primary peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                id="indicatorSearch"
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
              />
              <label
                htmlFor="indicatorSearch"
                className="peer-focus:text-primary dark:peer-focus:text-primary pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200"
              >
                Search Indicator
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
      {allElement.filter((el)=>el.name.indexOf(keyword) > -1).map((el) => (
        <Link
          key={el.name}
          href={id===el.id?'/series/'+id:'/series/'+id+'/'+el.id}
          className={clsx(
            'group grid items-center rounded-lg border border-slate-300 p-4 text-slate-700 ring-1 ring-transparent hover:bg-slate-200',
          )}
        >
          <h4>{el.name}</h4>
        </Link>
      ))}
    </div>

    </>
  );
}
