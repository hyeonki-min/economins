'use client';

import { useState, useCallback } from 'react';

export interface Candidate {
  id: string;
  name: string;
  type: string;
  initDate: string;
  start: number;
  end: number;
}

const candidates : Candidate[] = [
  {'id': 'base-rate-korea', 'name': '기준금리', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
  {'id': 'treasury-bond-korea-3','name': '국고채 3년(평균)', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
  {'id': 'treasury-bond-korea-5','name': '국고채 5년(평균)', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
  {'id': 'treasury-bond-korea-10','name': '국고채 10년(평균)', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
  {'id': 'corporate-bond-korea-3','name': '회사채 3년(평균)', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
  {'id': 'cd-91-korea','name': 'CD 91물(평균)', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
  {'id': 'call-rate-korea','name': '콜금리(1일물,평균)', 'type': 'rate', 'initDate': '2003-02', 'start': 0, 'end': 0},
  {'id': 'apt-price-index-all','name': '아파트 실거래가 지수 전국', 'type': 'apart', 'initDate': '2006-01', 'start': 0, 'end': 0},
  {'id': 'apt-price-index-greater-seoul','name': '아파트 실거래가 지수 수도권', 'type': 'apart', 'initDate': '2006-01', 'start': 0, 'end': 0},
  {'id': 'apt-price-index-seoul','name': '아파트 실거래가 지수 서울', 'type': 'apart', 'initDate': '2006-01', 'start': 0, 'end': 0},
]

export default function Candidate() {
  const [checkedList, setCheckedList] = useState<Candidate[]>([]);

  const onCheckedItem = useCallback(
    (checked: boolean, item: Candidate) => {
      if (checked) {
        // const initDate = new Date(item['initDate']);
        // let realStartMonth = startMonth - 1;
        // let realEndMonth = endMonth - 1;
        // let idx = monthDiff(initDate, new Date(startYear, realStartMonth));
        // let rangeIdx = monthDiff(new Date(startYear, realStartMonth), new Date(endYear, realEndMonth));
        // if(initDate > new Date(startYear, realStartMonth)){
        //   rangeIdx = monthDiff(initDate, new Date(endYear, realEndMonth));
        // }
        // item['start'] = idx;
        // item['end'] = rangeIdx;
        setCheckedList((prev) => [...prev, item]);
      } else if (!checked) {
        setCheckedList(checkedList.filter((el) => el.name !== item.name));
      }
    },
    [checkedList],
  );
  const monthDiff = (d1: Date, d2: Date) => {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  };

  return (
    <div className="mt-4 space-y-2">
      {candidates.map((type) => (
        <label
          htmlFor={type.name}
          key={type.name}
          className="has-[:checked]:ring-indigo-200 grid grid-cols-[1fr_auto] items-center gap-6 rounded-lg p-4 text-slate-700 ring-1 ring-transparent hover:bg-slate-100"
        >
          {type.name}
          <input
            name="data-type"
            id={type.name}
            value={type.name}
            type="checkbox"
            className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500"
            onChange={(e) => {
              onCheckedItem(e.target.checked, type);
            }}
          ></input>
        </label>
      ))}
    </div>
  );
}
