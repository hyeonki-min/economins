'use client';

import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useIndicatorStore } from '@/app/store/useIndicatorStore';
import { Indicator } from '@/app/lib/definitions';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';


export default function SearchModal(
  {
    firstIndicator,
    secondIndicator,
    children,
  }: {
    firstIndicator: Indicator,
    secondIndicator?: Indicator,
    children: React.ReactNode,
  }) {
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const { setSelected } = useIndicatorStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLink = () => {
    const segments = pathname.split('/'); 
    if (segments.length < 3) return;
    segments.pop();
    const newPath = segments.join('/');
    router.push(newPath);
  };

  useEffect(() => {
    if (firstIndicator) {
      setSelected({ clicked: 0, first: firstIndicator });
    } else if (secondIndicator) {
      setSelected({ clicked: 1, first: secondIndicator });
    }
  }, [firstIndicator, secondIndicator, setSelected]);

  return (
    <>
      <div className="flex items-center mb-2">
        <button
          className="group flex items-center gap-1 text-xl font-semibold"
          onClick={() => {
            setOpen(true);
            setSelected({
              clicked: 0,
              first: firstIndicator,
            });
          }}
        >
          <span className="group-hover:underline underline-offset-3 decoration-blue-500 transition">
            {firstIndicator.name}
          </span>
          <PlusCircleIcon
            className="w-5 h-5 text-blue-500 md:text-base"
          />
        </button>
      </div>
      <div className="flex items-center">
        <button
          className="group flex items-center gap-1 text-xl font-semibold"
          onClick={() => {
              setOpen(true);
              setSelected({
                clicked: 1,
                second: secondIndicator,
              });
          }}
        >
          <span
            className={clsx(
              'group-hover:underline underline-offset-3 decoration-blue-500 transition',
              secondIndicator ? 'text-xl' : 'text-sm text-gray-500'
            )}
          >
            {secondIndicator ? secondIndicator.name : '차트 추가하기'}
          </span>
          {!secondIndicator ? (
            <PlusCircleIcon className="w-5 h-5 text-blue-500 md:text-base" />
          ) : (
            <></>
          )}
        </button>
        {secondIndicator ? (
          <XCircleIcon className="w-5 h-5 text-red-500 cursor-pointer md:text-base hover:text-red-600" onClick={handleLink}/>
        ) : (
          <></>
        )}
      </div>
      <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 top-10 bg-gray-500/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-x-0 top-10 bottom-0 z-40 overflow-y-auto">
          <div className="flex justify-end min-h-full">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 -translate-y-2 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 -translate-y-2 sm:scale-95"
            >
              <Dialog.Panel
                className="
                  origin-top
                  w-full sm:max-w-lg
                  h-full
                  bg-gray-50 text-left
                  shadow-xl
                  border-l border-slate-200
                  rounded-none sm:rounded-b-xl
                "
              >
                {children}

                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    </>
  )
}
