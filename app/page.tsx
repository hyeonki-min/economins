'use client';
import styles from '@/app/ui/home.module.css';

import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import MyLineChart from '@/app/ui/line-chart';
import { useState, useCallback } from "react";

export interface Candidate {
  name: string,
  type: string
}

export default function Page() {
  const candidates : Candidate[] = [
    {'name': '기준금리', 'type': 'rate'},
    {'name': '국고채_3년(평균)', 'type': 'rate'},
    {'name': '국고채_5년(평균)', 'type': 'rate'},
    {'name': '국고채_10년(평균)', 'type': 'rate'},
    {'name': '회사채_3년(평균)', 'type': 'rate'},
    {'name': 'CD_91물(평균)', 'type': 'rate'},
    {'name': '콜금리(1일물,평균)', 'type': 'rate'},
    {'name': '전국', 'type': 'apart'},
    {'name': '수도권', 'type': 'apart'},
    {'name': '서울', 'type': 'apart'},
  ]
  // const candidates = ['기준금리', '국고채_3년(평균)', '국고채_5년(평균)', '국고채_10년(평균)', '회사채_3년(평균)', 'CD_91물(평균)', '콜금리(1일물,평균)', '전국', '수도권', '서울'];
  const [checkedList, setCheckedList] = useState<Candidate[]>([]);

  const onCheckedItem = useCallback(
    (checked: boolean, item: Candidate) => {
      if (checked) {
        setCheckedList((prev) => [...prev, item]);
      } else if (!checked) {
        setCheckedList(checkedList.filter((el) => el.name !== item.name));
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
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <MyLineChart dataType={checkedList}/>
        </div>
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <div className="mt-4 space-y-2">
            {candidates.map((type) => (
              <label htmlFor={type.name} key={type.name} className="text-slate-700 has-[:checked]:ring-indigo-200 has-[:checked]:text-indigo-800 has-[:checked]:bg-indigo-50 grid grid-cols-[1fr_auto] items-center gap-6 rounded-lg p-4 ring-1 ring-transparent hover:bg-slate-100">
              {type.name}
                <input name="data-type" id={type.name} value={type.name} type="checkbox" className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500" onChange={(e) => {onCheckedItem(e.target.checked, type);}}></input>
              </label>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
