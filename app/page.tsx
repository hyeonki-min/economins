'use client';
import styles from '@/app/ui/home.module.css';

import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import MyLineChart from '@/app/ui/line-chart';
import { useState, useCallback } from "react";

export default function Page() { 
  const [checkedList, setCheckedList] = useState<Array<string>>([]);

  const onCheckedItem = useCallback(
    (checked: boolean, item: string) => {
      if (checked) {
        setCheckedList((prev) => [...prev, item]);
      } else if (!checked) {
        setCheckedList(checkedList.filter((el) => !el.includes(item)));
      }
    },
    [checkedList]
  );

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <AcmeLogo />
        <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
          <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
        </Link>
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <div className="mt-4 space-y-2">
            <label htmlFor="base-rate" className="text-slate-700 has-[:checked]:ring-indigo-200 has-[:checked]:text-indigo-900 has-[:checked]:bg-indigo-50 grid grid-cols-[1fr_auto] items-center gap-6 rounded-lg p-4 ring-1 ring-transparent hover:bg-slate-100">
              기준금리
              <input name="data-type" id="base-rate" value="기준금리" type="checkbox" className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500" onChange={(e) => {onCheckedItem(e.target.checked, e.target.value)}}></input>
            </label>
            <label htmlFor="treasury-bond3" className="text-slate-700 has-[:checked]:ring-indigo-200 has-[:checked]:text-indigo-800 has-[:checked]:bg-indigo-50 grid grid-cols-[1fr_auto] items-center gap-6 rounded-lg p-4 ring-1 ring-transparent hover:bg-slate-100">
              국고채 3년(평균)
              <input name="data-type" id="treasury-bond3" value="국고채_3년(평균)" type="checkbox" className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500" onChange={(e) => {onCheckedItem(e.target.checked, e.target.value)}}></input>
            </label>
            <label htmlFor="treasury-bond5" className="text-slate-700 has-[:checked]:ring-indigo-200 has-[:checked]:text-indigo-800 has-[:checked]:bg-indigo-50 grid grid-cols-[1fr_auto] items-center gap-6 rounded-lg p-4 ring-1 ring-transparent hover:bg-slate-100">
              국고채 5년(평균)
              <input name="data-type" id="treasury-bond5" value="국고채_5년(평균)" type="checkbox" className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500" onChange={(e) => {onCheckedItem(e.target.checked, e.target.value)}}></input>
            </label>
            <label htmlFor="treasury-bond10" className="text-slate-700 has-[:checked]:ring-indigo-200 has-[:checked]:text-indigo-800 has-[:checked]:bg-indigo-50 grid grid-cols-[1fr_auto] items-center gap-6 rounded-lg p-4 ring-1 ring-transparent hover:bg-slate-100">
              국고채 10년(평균)
              <input name="data-type" id="treasury-bond10" value="국고채_10년(평균)" type="checkbox" className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500" onChange={(e) => {onCheckedItem(e.target.checked, e.target.value)}}></input>
            </label>
            <label htmlFor="corporate3" className="text-slate-700 has-[:checked]:ring-indigo-200 has-[:checked]:text-indigo-800 has-[:checked]:bg-indigo-50 grid grid-cols-[1fr_auto] items-center gap-6 rounded-lg p-4 ring-1 ring-transparent hover:bg-slate-100">
              회사채 3년(평균)
              <input name="data-type" id="corporate3" value="회사채_3년(평균)" type="checkbox" className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500" onChange={(e) => {onCheckedItem(e.target.checked, e.target.value)}}></input>
            </label>
            <label htmlFor="cd91" className="text-slate-700 has-[:checked]:ring-indigo-200 has-[:checked]:text-indigo-800 has-[:checked]:bg-indigo-50 grid grid-cols-[1fr_auto] items-center gap-6 rounded-lg p-4 ring-1 ring-transparent hover:bg-slate-100">
              CD 91물(평균)
              <input name="data-type" id="cd91" value="CD_91물(평균)" type="checkbox" className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500" onChange={(e) => {onCheckedItem(e.target.checked, e.target.value)}}></input>
            </label>
            <label htmlFor="call1" className="text-slate-700 has-[:checked]:ring-indigo-200 has-[:checked]:text-indigo-800 has-[:checked]:bg-indigo-50 grid grid-cols-[1fr_auto] items-center gap-6 rounded-lg p-4 ring-1 ring-transparent hover:bg-slate-100">
              콜금리(1일물,평균)
              <input name="data-type" id="call1" value="콜금리(1일물,평균)" type="checkbox" className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500" onChange={(e) => {onCheckedItem(e.target.checked, e.target.value)}}></input>
            </label>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <MyLineChart dataType={checkedList}/>
        </div>
      </div>
    </main>
  );
}
