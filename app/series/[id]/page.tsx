'use client';

import MyLineChart from '@/app/ui/line-chart';
import { useState, useCallback, useEffect } from "react";
import { notFound } from 'next/navigation';

export interface Candidate {
  id: string
  name: string,
  type: string,
  initDate: string,
  start: number,
  end: number
}

export default function Page({ params }: { params: { id: string}}) {
  const id = params.id;
  const candidates : Candidate[] = [
    {'id': 'base_rate_korea', 'name': '기준금리', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
    {'id': 'treasury_bond_korea_3','name': '국고채_3년(평균)', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
    {'id': 'treasury_bond_korea_5','name': '국고채_5년(평균)', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
    {'id': 'treasury_bond_korea_10','name': '국고채_10년(평균)', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
    {'id': 'corporate_bond_korea_3','name': '회사채_3년(평균)', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
    {'id': 'cd_91_korea','name': 'CD_91물(평균)', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
    {'id': 'call_rate_korea','name': '콜금리(1일물,평균)', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
    {'id': 'apt_price_index_all','name': '아파트_실거래가_지수_전국', 'type': 'apart', 'initDate': '2006-01', 'start': 0, 'end': 0},
    {'id': 'apt_price_index_greater_seoul','name': '아파트_실거래가_지수_수도권', 'type': 'apart', 'initDate': '2006-01', 'start': 0, 'end': 0},
    {'id': 'apt_price_index_seoul','name': '아파트_실거래가_지수_서울', 'type': 'apart', 'initDate': '2006-01', 'start': 0, 'end': 0},
  ]
  const real = candidates.filter(function (el) {
    return el.id === id;
  });
  if (real.length<1) {
    notFound();
  }
  const [startYear, setStartYear] = useState(new Date().getFullYear() -3);
  const [startMonth, setStartMonth] = useState(new Date().getMonth()+1);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [endMonth, setEndMonth] = useState(new Date().getMonth()+1);

  const [checkedList, setCheckedList] = useState<Candidate[]>(real);

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
      <div className="m-0 m-auto flex max-w-screen-2xl gap-4 md:flex-row">
        <div className="flex flex-col p-6 md:w-4/5 md:py-12">
          <div className="flex items-center justify-center">
            <input type="number" id="startYear" aria-describedby="helper-text-explanation" className="border border-white text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            min='1900' max={new Date().getFullYear()} value={startYear} onChange={(e) => setStartYear(e.target.valueAsNumber)}></input>
            <input type="number" id="startMonth" aria-describedby="helper-text-explanation" className="border border-white text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            min='1' max='12' value={startMonth} onChange={(e) => setStartMonth(e.target.valueAsNumber)}></input>
            <input type="number" id="endYear" aria-describedby="helper-text-explanation" className="border border-white text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            min='1900' max={new Date().getFullYear()} value={endYear} onChange={(e) => setEndYear(e.target.valueAsNumber)}></input>
            <input type="number" id="endMonth" aria-describedby="helper-text-explanation" className="border border-white text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            min='1' max='12' value={endMonth} onChange={(e) => setEndMonth(e.target.valueAsNumber)}></input>
          </div>
          <div className="flex items-center justify-center">
            <MyLineChart dataType={checkedList}/>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-1/5">
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
  );
}