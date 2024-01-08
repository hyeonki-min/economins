'use client';
import styles from '@/app/ui/home.module.css';

import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import MyLineChart from '@/app/ui/line-chart';
import { useState, useCallback, useEffect } from "react";

export interface Candidate {
  name: string,
  type: string,
  initDate: string,
  start: number,
  end: number
}

export default function Page() {
  const candidates : Candidate[] = [
    {'name': '기준금리', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
    {'name': '국고채_3년(평균)', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
    {'name': '국고채_5년(평균)', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
    {'name': '국고채_10년(평균)', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
    {'name': '회사채_3년(평균)', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
    {'name': 'CD_91물(평균)', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
    {'name': '콜금리(1일물,평균)', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
    {'name': '전국', 'type': 'apart', 'initDate': '2006-01', 'start': 0, 'end': 0},
    {'name': '수도권', 'type': 'apart', 'initDate': '2006-01', 'start': 0, 'end': 0},
    {'name': '서울', 'type': 'apart', 'initDate': '2006-01', 'start': 0, 'end': 0},
  ]
  // const candidates = ['기준금리', '국고채_3년(평균)', '국고채_5년(평균)', '국고채_10년(평균)', '회사채_3년(평균)', 'CD_91물(평균)', '콜금리(1일물,평균)', '전국', '수도권', '서울'];
 
  const [startYear, setStartYear] = useState(new Date().getFullYear() -1);
  const [startMonth, setStartMonth] = useState(new Date().getMonth()+1);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [endMonth, setEndMonth] = useState(new Date().getMonth()+1);

  const [checkedList, setCheckedList] = useState<Candidate[]>([]);

  const onCheckedItem = useCallback(
    (checked: boolean, item: Candidate) => {
      if (checked) {
        const initDate = new Date(item['initDate']);
        let realStartMonth = startMonth - 1;
        let realEndMonth = endMonth - 1;
        let idx = monthDiff(initDate, new Date(startYear, realStartMonth));
        let rangeIdx = monthDiff(new Date(startYear, realStartMonth), new Date(endYear, realEndMonth));
        if(initDate > new Date(startYear, realStartMonth)){
          rangeIdx = monthDiff(initDate, new Date(endYear, realEndMonth));
        }
        item['start'] = idx;
        item['end'] = rangeIdx;  
        setCheckedList((prev) => [...prev, item]);
      } else if (!checked) {
        setCheckedList(checkedList.filter((el) => el.name !== item.name));
      }
    },
    [checkedList]
  );

  useEffect(() => {
    const thisYear = new Date().getFullYear();
    if(startYear > thisYear || endYear > thisYear){
      return;
    }
    checkedList.map((item) => {
      const initDate = new Date(item['initDate']);
      let realStartMonth = startMonth - 1;
      let realEndMonth = endMonth - 1;
      let idx = monthDiff(initDate, new Date(startYear, realStartMonth));
      let rangeIdx = monthDiff(new Date(startYear, realStartMonth), new Date(endYear, realEndMonth));
      if(initDate > new Date(startYear, realStartMonth)){
        rangeIdx = monthDiff(initDate, new Date(endYear, realEndMonth));
      }
      item['start'] = idx;
      item['end'] = rangeIdx;
      setCheckedList((prev) => [...prev, item]);
    });
  }, [startYear, startMonth, endYear, endMonth]);

  const monthDiff = (d1:Date, d2:Date) => {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

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
      <div className="flex h-20 shrink-0 items-end rounded-lg p-4 md:h-12">
        <label htmlFor="startYear" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">:</label>
        <input type="number" id="startYear" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
         min='1900' max={new Date().getFullYear()} value={startYear} onChange={(e) => setStartYear(e.target.valueAsNumber)}></input>
        <label htmlFor="startMonth" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">:</label>
        <input type="number" id="startMonth" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
         min='1' max='12' value={startMonth} onChange={(e) => setStartMonth(e.target.valueAsNumber)}></input>
        <label htmlFor="endYear" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">:</label>
        <input type="number" id="endYear" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
         min='1900' max={new Date().getFullYear()} value={endYear} onChange={(e) => setEndYear(e.target.valueAsNumber)}></input>
        <label htmlFor="endMonth" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">:</label>
        <input type="number" id="endMonth" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
         min='1' max='12' value={endMonth} onChange={(e) => setEndMonth(e.target.valueAsNumber)}></input>
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
