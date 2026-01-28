'use client';

import clsx from 'clsx';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce';
import { Indicator } from '@/app/lib/definitions';
import { useIndicatorStore } from '@/app/store/useIndicatorStore';
import { usePathname, useRouter } from 'next/navigation';


export default function SearchResults({id, indicators}: {id: string, indicators: Indicator[]}) {
  const router = useRouter();
  const pathname = usePathname();
  const [keyword, setKeyword] = useState<string>('');
  const handleSearch = useDebouncedCallback((term) => {
    setKeyword(term);
  }, 300);
  const selectedIndicator = useIndicatorStore((state) => state.selected);

  const handleLink = (id: string) => {
    const segments = pathname.split('/'); 
    if (segments.length < 2) return;

    if (selectedIndicator.clicked === 0) {
      segments[2] = id;
    } else {
      if (segments.length < 3) {
        segments.push(id);
      } else {
        if (segments[2] != id) {
          segments[3] = id;
        }
      }
    }

    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <>
    <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
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
      <div className="m-2 space-y-2">
        {indicators
          .filter((el) => el.name.includes(keyword.toUpperCase()))
          .map((el) => {
            const isSelected = (el.id === selectedIndicator?.first?.id) || (el.id === selectedIndicator?.second?.id);

            return (
              <span
                key={el.id}
                className={clsx(
                  'group grid items-center justify-start gap-2 rounded-xl border border-slate-200 shadow-sm p-4 text-slate-800 transition-all duration-200 ease-in-out',
                  isSelected
                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'hover:bg-blue-50 hover:border-blue-300 cursor-pointer'
                )}
                onClick={() => {
                  if (!isSelected) handleLink(el.id);
                }}
              >
                {el.name}
              </span>
            );
          })}    </div>

    </>
  );
}
