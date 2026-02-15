import { FinanceCardData } from '@/app/lib/simulator/types';
import clsx from 'clsx';
import { useState } from 'react';
import Modal from '@/app/ui/simulator/modal';
import LivingExpenseModal from '@/app/ui/simulator/modal/living-expense-modal';
import ChildExpenseModal from '@/app/ui/simulator/modal/child-expense-modal';
import SalaryIncreaseRateModal from '@/app/ui/simulator/modal/salary-raise-modal';
import TaxModal from '@/app/ui/simulator/modal/tax-modal';
import MarriageExpenseModal from '@/app/ui/simulator/modal/marriage-expense-modal';
import MortgageLoanModal from '@/app/ui/simulator/modal/mortgage-loan-modal';
import RealEstateEquityModal from '@/app/ui/simulator/modal/real-estate-equity-modal';
import RetirementPensionModal from '@/app/ui/simulator/modal/retire-pension-modal';
import EtfInvestmentModal from '@/app/ui/simulator/modal/etf-investment-modal';
import DepositSavingModal from '@/app/ui/simulator/modal/deposit-saving-modal';
import JeonseModal from '@/app/ui/simulator/modal/jeonse-modal';

type ActiveKey =
  | 'salary'
  | 'netMonthlyIncome'
  | 'expense'
  | 'saving'
  | 'asset'
  | 'liability'
  | null;

interface Props {
  data: FinanceCardData;
  active: ActiveKey;
  setActive: (v: ActiveKey) => void;
}

type Color = 'blue' | 'indigo' | 'red' | 'rose' | 'green' | 'emerald';

const activeColorClass: Record<Color, string> = {
  blue: 'bg-blue-100 ring-2 ring-blue-300 focus:ring-blue-300',
  indigo: 'bg-indigo-100 ring-2 ring-indigo-300 focus:ring-indigo-300',
  red: 'bg-red-100 ring-2 ring-red-300 focus:ring-red-300',
  rose: 'bg-rose-100 ring-2 ring-rose-300 focus:ring-rose-300',
  green: 'bg-green-100 ring-2 ring-green-300 focus:ring-green-300',
  emerald: 'bg-emerald-100 ring-2 ring-emerald-300 focus:ring-emerald-300',
};

type InfoModalType = 'living' | 'child' | 'salary' | 'tax' | 'marriage' | 'mortgage' | 'realestate' | 'retire' | 'saving' | 'etf' | 'housingDeposit' | null

const modalConfig = {
  living: {
    title: '생활비는 어떻게 계산하나요?',
    content: <LivingExpenseModal />,
  },
  child: {
    title: '자녀 양육비는 어떻게 계산하나요?',
    content: <ChildExpenseModal />,
  },
  salary: {
    title: '연봉 상승률은 어떻게 정해지나요?',
    content: <SalaryIncreaseRateModal />,
  },
  tax: {
    title: '4대보험 및 세금은 어떻게 계산하나요?',
    content: <TaxModal />,
  },
  marriage: {
    title: '결혼 비용은 어떻게 계산하나요?',
    content: <MarriageExpenseModal />,
  },
  mortgage: {
    title: '집값과 대출은 어떻게 계산하나요?',
    content: <MortgageLoanModal />,
  },
  realestate: {
    title: '부동산 지분이란?',
    content: <RealEstateEquityModal />,
  },
  retire : {
    title: '퇴직 연금 수령액은 어떻게 계산하나요?',
    content: <RetirementPensionModal />,
  },
  saving : {
    title: '예금/적금은 어떻게 계산하나요?',
    content: <DepositSavingModal />,
  },
  etf : {
    title: 'ETF는 어떻게 계산하나요?',
    content: <EtfInvestmentModal />,
  },
  housingDeposit : {
    title: '전월세 보증금의 함정',
    content: <JeonseModal />,
  }
} as const


function SummaryButton({
  label,
  value,
  unit = '만원',
  activeKey,
  active,
  onClick,
  color,
}: {
  label: string;
  value: number | null;
  unit?: string;
  activeKey: ActiveKey;
  active: ActiveKey;
  onClick: () => void;
  color: Color;
}) {
  const isActive = active === activeKey;

  return (
    <button
      onClick={onClick}
      className={clsx(
        'p-3 rounded-xl text-left transition-all',
        'hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        isActive
          ? activeColorClass[color]
          : 'bg-gray-50 hover:bg-gray-100'
      )}
    >
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-base font-bold text-gray-900">
        {value !== null ? `${value.toLocaleString()} ${unit}` : '—'}
      </p>
    </button>
  );
}

export default function FinanceMiniCard({ data, active, setActive }: Props) {
  const [openModal, setOpenModal] = useState<InfoModalType>(null)

  return (
    <div className="
      w-full
      max-w-md
      mx-auto
      mt-4 sm:mt-6
      bg-white
      rounded-2xl sm:rounded-3xl
      shadow-md sm:shadow-lg
      p-4 sm:p-6
      space-y-4
    ">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <SummaryButton
          label="연봉"
          value={data.salary.annualIncome}
          activeKey="salary"
          active={active}
          color="blue"
          onClick={() => setActive(active === 'salary' ? null : 'salary')}
        />

        <SummaryButton
          label="월 실수령"
          value={data.monthly.net}
          activeKey="netMonthlyIncome"
          active={active}
          color="indigo"
          onClick={() =>
            setActive(active === 'netMonthlyIncome' ? null : 'netMonthlyIncome')
          }
        />

        <SummaryButton
          label="월 소비"
          value={data.expense?.total ?? null}
          activeKey="expense"
          active={active}
          color="red"
          onClick={() => setActive(active === 'expense' ? null : 'expense')}
        />

        <SummaryButton
          label="월 저축"
          value={data.saving?.total ?? null}
          activeKey="saving"
          active={active}
          color="green"
          onClick={() => setActive(active === 'saving' ? null : 'saving')}
        />

        <SummaryButton
          label="순자산"
          value={data.accumulated.grossAssetsAbs}
          activeKey="asset"
          active={active}
          color="emerald"
          onClick={() => setActive(active === 'asset' ? null : 'asset')}
        />
        
        <SummaryButton
          label="부채"
          value={data.liability.total}
          activeKey="liability"
          active={active}
          color="rose"
          onClick={() => setActive(active === 'liability' ? null : 'liability')}
        />
      </div>

      {/* 상세 패널 */}
      <div
        className={`
          overflow-hidden transition-all duration-300
          ${active ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
        `}
      >
        {active && (
          <div className="mt-4 p-4 rounded-xl bg-gray-50 space-y-2">
            {openModal && (
              <Modal
                open
                onClose={() => setOpenModal(null)}
                title={modalConfig[openModal].title}
              >
                {modalConfig[openModal].content}
              </Modal>
            )}
            {active === 'salary' && (
              <>
              <div className="border-b border-slate-100">
                <p className="font-semibold text-blue-700">
                  연봉 상세
                </p>
              </div>

              <div className="px-4 py-3 space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">연봉 상승률</span>

                    <button
                      type="button"
                      onClick={() => setOpenModal('salary')}
                      className="
                        text-slate-400
                        hover:text-slate-600
                        transition
                      "
                      aria-label="연봉 상승률 설명"
                    >
                      ⓘ
                    </button>
                  </div>
                  <span className="font-semibold text-slate-800">
                    {data.salary.increaseRate.toLocaleString()}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">연봉 상승 금액</span>
                  <span className="font-semibold">
                    {data.salary.increaseAmount.toLocaleString()} 만원
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">퇴직연금 납입금</span>
                  <span className="font-semibold">
                    {data.salary.rp.toLocaleString()} 만원
                  </span>
                </div>
              </div>
              </>
            )}

            {active === 'netMonthlyIncome' && (
              <>
                <div className="border-b border-slate-100">
                  <p className="font-semibold text-indigo-700">
                    월 실수령액 상세
                  </p>
                </div>

                <div className="px-4 py-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">세전 급여</span>
                    <span className="font-semibold text-slate-800">
                      {data.monthly?.gross ?? '—'} 만원
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">4대 보험 및 세금</span>

                      <button
                        type="button"
                        onClick={() => setOpenModal('tax')}
                        className="
                          text-slate-400
                          hover:text-slate-600
                          transition
                        "
                        aria-label="4대 보험 및 세금 설명"
                      >
                        ⓘ
                      </button>
                    </div>
                    <span className="font-semibold">
                      {data.monthly?.tax ?? '—'} 만원
                    </span>
                  </div>
                </div>
              </>
            )}

            {active === 'expense' && (
              <>
                <div className="border-b border-slate-100">
                  <p className="font-semibold text-red-700">
                    소비 상세
                  </p>
                </div>

                <div className="px-4 py-3 space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">생활비</span>

                      <button
                        type="button"
                        onClick={() => setOpenModal('living')}
                        className="
                          text-slate-400
                          hover:text-slate-600
                          transition
                        "
                        aria-label="생활비 설명"
                      >
                        ⓘ
                      </button>
                    </div>
                    <span className="font-semibold text-slate-800">
                      {data.expense.living.toLocaleString()} 만원
                    </span>
                  </div>
                  {data.expense.rent > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">주거비</span>
                    <span className="font-semibold">
                      {data.expense.rent.toLocaleString()} 만원
                    </span>
                  </div>
                  )}
                  {data.expense.child > 0 && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">자녀 양육비</span>

                      <button
                        type="button"
                        onClick={() => setOpenModal('child')}
                        className="
                          text-slate-400
                          hover:text-slate-600
                          transition
                        "
                        aria-label="자녀 양육비 설명"
                      >
                        ⓘ
                      </button>
                    </div>
                    <span className="font-semibold">
                      {data.expense.child.toLocaleString()} 만원
                    </span>
                  </div>
                  )}
                  {data.expense.marriage > 0 && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">결혼 비용</span>

                      <button
                        type="button"
                        onClick={() => setOpenModal('marriage')}
                        className="
                          text-slate-400
                          hover:text-slate-600
                          transition
                        "
                        aria-label="결혼 비용 설명"
                      >
                        ⓘ
                      </button>
                    </div>
                    <span className="font-semibold">
                      {data.expense.marriage.toLocaleString()} 만원
                    </span>
                  </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">대출 이자</span>
                    <span className="font-semibold">
                      {data.expense.loanInterest.toLocaleString()} 만원
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-500">대출 원금</span>
                    <span className="font-semibold">
                      {data.expense.loanPrincipal.toLocaleString()} 만원
                    </span>
                  </div>
                </div>
              </>
            )}

            {active === 'saving' && (
              <>
                <div className="border-b border-slate-100">
                    <p className="font-semibold text-green-700">
                      저축 상세
                    </p>
                  </div>

                  <div className="px-4 py-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">적금</span>
                      <span className="font-semibold text-slate-800">
                        {data.saving.deposit.toLocaleString()} 만원
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">ETF</span>
                      <span className="font-semibold">
                        {data.saving.etf.toLocaleString()} 만원
                      </span>
                    </div>
                    <div className="border-b border-slate-100">
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">연 예상 저축</span>
                      <span className="font-semibold">
                        {data.saving.annual.toLocaleString()} 만원
                      </span>
                    </div>
                  </div>
              </>
            )}

            {active === 'asset' && (
              <>
                <div className="border-b border-slate-100">
                  <p className="font-semibold text-emerald-700">
                    자산 상세
                  </p>
                </div>

                <div className="px-4 py-3 space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">예금/적금</span>

                      <button
                        type="button"
                        onClick={() => setOpenModal('saving')}
                        className="
                          text-slate-400
                          hover:text-slate-600
                          transition
                        "
                        aria-label="예금/적금 설명"
                      >
                        ⓘ
                      </button>
                    </div>
                    <span className="font-semibold text-slate-800">
                      {data.accumulated.deposit.toLocaleString()} 만원
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">ETF</span>

                      <button
                        type="button"
                        onClick={() => setOpenModal('etf')}
                        className="
                          text-slate-400
                          hover:text-slate-600
                          transition
                        "
                        aria-label="ETF 설명"
                      >
                        ⓘ
                      </button>
                    </div>
                    <span className="font-semibold">
                      {data.accumulated.etf.toLocaleString()} 만원
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">부동산 지분</span>

                      <button
                        type="button"
                        onClick={() => setOpenModal('realestate')}
                        className="
                          text-slate-400
                          hover:text-slate-600
                          transition
                        "
                        aria-label="부동산 지분 설명"
                      >
                        ⓘ
                      </button>
                    </div>
                    <span className="font-semibold">
                      {data.accumulated.realEstate.toLocaleString()} 만원
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">전월세 보증금</span>

                      <button
                        type="button"
                        onClick={() => setOpenModal('housingDeposit')}
                        className="
                          text-slate-400
                          hover:text-slate-600
                          transition
                        "
                        aria-label="전월세 보증금 설명"
                      >
                        ⓘ
                      </button>
                    </div>
                    <span className="font-semibold">
                      {data.accumulated.housingDeposit.toLocaleString()} 만원
                    </span>
                  </div>
                  {data.age == 60 && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">퇴직 연금 수령액</span>

                      <button
                        type="button"
                        onClick={() => setOpenModal('retire')}
                        className="
                          text-slate-400
                          hover:text-slate-600
                          transition
                        "
                        aria-label=" 퇴직 연금 수령액 설명"
                      >
                        ⓘ
                      </button>
                    </div>
                    <span className="font-semibold">
                      {data.accumulated.totalRp.toLocaleString()} 만원
                    </span>
                  </div>
                  )}
                  {data.accumulated.purchaseHousePrice > 0 && (
                  <>
                    <div className="border-b border-slate-100">
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">부동산 구매 금액</span>
                      <span className="font-semibold">
                        {data.accumulated.purchaseHousePrice.toLocaleString()} 만원
                      </span>
                    </div>
                  </>
                  )}
                </div>
              </>
            )}

            {active === 'liability' && (
              <>
                <div className="border-b border-slate-100">
                  <p className="font-semibold text-emerald-700">
                    부채 상세
                  </p>
                </div>

                <div className="px-4 py-3 space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">주담대 원금</span>

                      <button
                        type="button"
                        onClick={() => setOpenModal('mortgage')}
                        className="
                          text-slate-400
                          hover:text-slate-600
                          transition
                        "
                        aria-label="주담대 원금 설명"
                      >
                        ⓘ
                      </button>
                    </div>
                    <span className="font-semibold text-slate-800">
                      {data.liability.mortgage.loanAmount.toLocaleString()}만원
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">주담대 이율</span>
                    <span className="font-semibold">
                      {data.liability.mortgage.loanRate.toLocaleString()} %
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-500">주담대 잔여 대출</span>
                    <span className="font-semibold">
                      {data.liability.mortgage.remainingLoan.toLocaleString()} 만원
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-500">생활비 대출</span>
                    <span className="font-semibold text-slate-800">
                      {data.liability.consumerDebt.toLocaleString()}만원
                    </span>
                  </div>

                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
