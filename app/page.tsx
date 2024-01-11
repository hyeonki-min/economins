import styles from '@/app/ui/home.module.css';

import AcmeLogo from '@/app/ui/acme-logo';
import Link from 'next/link';


export default function Page() {
  return (
    <main className="min-h-screen flex-col bg-slate-50">
      <div className="flex h-12 shrink-0 items-end bg-blue-500 p-2 md:h-12">
        <AcmeLogo />
        <Link
            href="/about"
            className="flex items-center gap-5 self-start bg-blue-500 px-6 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
          <span>About</span>
        </Link>
      </div>
      <div className="m-0 m-auto flex max-w-screen-2xl">
        <div className="grid grid-flow-row grid-cols-4 gap-4 text-slate-700 shadow">
          <Link 
            href="/series/base_rate_korea"
            className="text-slate-700 group grid grid-rows-[32px_1fr_auto] items-center p-4 ring-1 ring-transparent rounded-lg border border-slate-300 hover:bg-slate-200"
          >
          <h4>💸기준금리</h4>
          <p className="text-sm">한국은행</p>
          </Link>
          <Link 
            href="/series/treasury_bond_korea_3"
            className="text-slate-700 group grid grid-rows-[32px_1fr_auto] items-center p-4 ring-1 ring-transparent rounded-lg border border-slate-300 hover:bg-slate-200"
          >
          <h4>💸국고채 3년</h4>
          <p className="text-sm">한국은행</p>
          </Link>
          <Link 
            href="/series/treasury_bond_korea_5"
            className="text-slate-700 group grid grid-rows-[32px_1fr_auto] items-center p-4 ring-1 ring-transparent rounded-lg border border-slate-300 hover:bg-slate-200"
          >
          <h4>💸국고채 5년</h4>
          <p className="text-sm">한국은행</p>
          </Link>
          <Link 
            href="/series/treasury_bond_korea_10"
            className="text-slate-700 group grid grid-rows-[32px_1fr_auto] items-center p-4 ring-1 ring-transparent rounded-lg border border-slate-300 hover:bg-slate-200"
          >
          <h4>💸국고채 10년</h4>
          <p className="text-sm">한국은행</p>
          </Link>
          <Link 
            href="/series/corporate_bond_korea_3"
            className="text-slate-700 group grid grid-rows-[32px_1fr_auto] items-center p-4 ring-1 ring-transparent rounded-lg border border-slate-300 hover:bg-slate-200"
          >
          <h4>💸회사채 3년</h4>
          <p className="text-sm">한국은행</p>
          </Link>
          <Link 
            href="/series/cd_91_korea"
            className="text-slate-700 group grid grid-rows-[32px_1fr_auto] items-center p-4 ring-1 ring-transparent rounded-lg border border-slate-300 hover:bg-slate-200"
          >
          <h4>💸CD 91물</h4>
          <p className="text-sm">한국은행</p>
          </Link>
          <Link 
            href="/series/call_rate_korea"
            className="text-slate-700 group grid grid-rows-[32px_1fr_auto] items-center p-4 ring-1 ring-transparent rounded-lg border border-slate-300 hover:bg-slate-200"
          >
          <h4>💸콜금리 1일물</h4>
          <p className="text-sm">한국은행</p>
          </Link>
          <Link 
            href="/series/apt_price_index_all"
            className="text-slate-700 group grid grid-rows-[32px_1fr_auto] items-center p-4 ring-1 ring-transparent rounded-lg border border-slate-300 hover:bg-slate-200"
          >
          <h4>🏠전국 아파트 실거래가 지수</h4>
          <p className="text-sm">한국부동산원</p>
          </Link>
          <Link 
            href="/series/apt_price_index_greater_seoul"
            className="text-slate-700 group grid grid-rows-[32px_1fr_auto] items-center p-4 ring-1 ring-transparent rounded-lg border border-slate-300 hover:bg-slate-200"
          >
          <h4>🏠수도권 아파트 실거래가 지수</h4>
          <p className="text-sm">한국부동산원</p>
          </Link>
          <Link 
            href="/series/apt_price_index_seoul"
            className="text-slate-700 group grid grid-rows-[32px_1fr_auto] items-center p-4 ring-1 ring-transparent rounded-lg border border-slate-300 hover:bg-slate-200"
          >
          <h4>🏠서울 아파트 실거래가 지수</h4>
          <p className="text-sm">한국부동산원</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
