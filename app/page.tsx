'use client';

import styles from '@/app/ui/home.module.css';
import EconominsLogo from '@/app/ui/logo';
import Link from 'next/link';
import { useState } from "react";
import clsx from 'clsx';

const allTypes: string[] = ['전체', '금리', '아파트실거래가'];

const allElement = [
  {'name': '💸기준금리', 'type': '금리', 'source': '한국은행', 'path':'/series/base_rate_korea'},
  {'name': '💸국고채 3년', 'type': '금리', 'source': '한국은행', 'path':'/series/treasury_bond_korea_3'},
  {'name': '💸국고채 5년', 'type': '금리', 'source': '한국은행', 'path':'/series/treasury_bond_korea_5'},
  {'name': '💸국고채 10년', 'type': '금리', 'source': '한국은행', 'path':'/series/treasury_bond_korea_10'},
  {'name': '💸회사채 3년', 'type': '금리', 'source': '한국은행', 'path':'/series/corporate_bond_korea_3'},
  {'name': '💸CD 91물', 'type': '금리', 'source': '한국은행', 'path':'/series/cd_91_korea'},
  {'name': '💸콜금리 1일물', 'type': '금리', 'source': '한국은행', 'path':'/series/call_rate_korea'},
  {'name': '🏠전국 아파트 실거래가 지수', 'type': '아파트실거래가', 'source': '한국부동산원', 'path':'/series/apt_price_index_all'},
  {'name': '🏠수도권 아파트 실거래가 지수', 'type': '아파트실거래가', 'source': '한국부동산원', 'path':'/series/apt_price_index_greater_seoul'},
  {'name': '🏠서울 아파트 실거래가 지수', 'type': '아파트실거래가', 'source': '한국부동산원', 'path':'/series/apt_price_index_seoul'},
];


export default async function Page() {
  const [types, setTypes] = useState<string>('전체');
  return (
    <main className="min-h-screen flex-col bg-slate-50">
      <div className="flex h-12 shrink-0 items-end p-2 md:h-12">
        <EconominsLogo />
      </div>
      <div className="m-0 m-auto grid max-w-screen-2xl">
        <div className="grid grid-flow-row grid-cols-4 gap-4 text-slate-700">
          <div className="flex gap-2 col-span-4">
            {allTypes.map((type) => (
              
              <label htmlFor={type} key={type} 
              className={clsx(
              'border bg-slate-100 text-slate-700 has-[:checked]:text-slate-50 has-[:checked]:bg-neutral-950 items-center rounded-lg p-1 cursor-pointer',
              {
                'hover:bg-slate-200': type != types,
              }
              )}>
              {type}
                <input name="data-type" id={type} value={type} type="radio" className="hidden peer" onChange={(e) => setTypes(e.target.value)} checked={type===types}></input>
              </label>
            ))}
          </div>
          {
            allElement.map((el)=>(
              <Link 
              key={el.name}
              href={el.path}
              className={clsx(
                'text-slate-700 group grid grid-rows-[32px_1fr_auto] items-center p-4 ring-1 ring-transparent rounded-lg border border-slate-300 hover:bg-slate-200',
                {
                  'hidden': types !== "전체"? el.type !== types: false,
                }
              )}
              >
              <h4>{el.name}</h4>
              <p className="text-xs">{el.source}</p>
              </Link>
            ))
          }
        </div>
      </div>
    </main>
  );
}
