import Link from 'next/link';
import clsx from 'clsx';
import createPresignedUrl from '@/app/lib/economins';

export interface Candidate {
  id: string;
  name: string;
  type: string;
  initDate: string;
  start: number;
  end: number;
}

const allElement : Candidate[] = [
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

export interface Element {
  name: string,
  type: string,
  source: string,
  id: string
}

export default async function SearchResult({id}: {id: string}) {
  const allElement: Element[] = await createPresignedUrl({ key: 'main/main' });
  
  return (
    <div className="mt-4 space-y-2">
      {allElement.map((el) => (
        <Link
          key={el.name}
          href={id+'/'+el.id}
          className={clsx(
            'group grid items-center rounded-lg border border-slate-300 p-4 text-slate-700 ring-1 ring-transparent hover:bg-slate-200',
            // {
            //   'hidden': types !== "전체"? el.type !== types: false,
            // }
          )}
        >
          <h4>{el.name}</h4>
        </Link>
      ))}
    </div>
  );
}
