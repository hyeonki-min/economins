import { FinanceCardData } from '@/app/lib/simulator/types';
import { useState } from 'react';
import Modal from '@/app/ui/simulator/modal';
import InfoButton from '@/app/ui/simulator/info-button'
import {
  InfoModalType,
  modalTitleMap,
  modalComponentMap,
} from '@/app/lib/simulator/modal-config'
import SummaryButton from '@/app/ui/simulator/summary-button';
import { ActiveKey } from '@/app/lib/definitions';


interface Props {
  data: FinanceCardData;
  active: ActiveKey;
  setActive: (v: ActiveKey) => void;
}

export default function FinanceMiniCard({ data, active, setActive }: Props) {
  const [openModal, setOpenModal] = useState<InfoModalType>(null)
  const ContentComponent = openModal ? modalComponentMap[openModal] : null

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
          isActive={active === 'salary'}
          color="blue"
          onClick={() => setActive(active === 'salary' ? null : 'salary')}
        />

        <SummaryButton
          label="월 실수령"
          value={data.monthly.net}
          isActive={active === 'netMonthlyIncome'}
          color="indigo"
          onClick={() =>
            setActive(active === 'netMonthlyIncome' ? null : 'netMonthlyIncome')
          }
        />

        <SummaryButton
          label="월 소비"
          value={data.expense?.total ?? null}
          isActive={active === 'expense'}
          color="red"
          onClick={() => setActive(active === 'expense' ? null : 'expense')}
        />

        <SummaryButton
          label="월 저축"
          value={data.saving?.total ?? null}
          isActive={active === 'saving'}
          color="green"
          onClick={() => setActive(active === 'saving' ? null : 'saving')}
        />

        <SummaryButton
          label="순자산"
          value={data.accumulated.grossAssetsAbs}
          isActive={active === 'asset'}
          color="emerald"
          onClick={() => setActive(active === 'asset' ? null : 'asset')}
        />
        
        <SummaryButton
          label="부채"
          value={data.liability.total}
          isActive={active === 'liability'}
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
            {openModal && ContentComponent && (
              <Modal
                open
                onClose={() => setOpenModal(null)}
                title={modalTitleMap[openModal]}
              >
                <ContentComponent />
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
                    <InfoButton
                      modalKey="salary"
                      onOpen={setOpenModal}
                      ariaLabel="연봉 상승률 설명"
                    />
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
                      <InfoButton
                        modalKey="tax"
                        onOpen={setOpenModal}
                        ariaLabel="4대 보험 및 세금 설명"
                      />
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
                      <InfoButton
                        modalKey="living"
                        onOpen={setOpenModal}
                        ariaLabel="생활비 설명"
                      />
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
                      <InfoButton
                        modalKey="child"
                        onOpen={setOpenModal}
                        ariaLabel="자녀 양육비 설명"
                      />
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
                      <InfoButton
                        modalKey="marriage"
                        onOpen={setOpenModal}
                        ariaLabel="결혼 비용 설명"
                      />
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
                      <InfoButton
                        modalKey="saving"
                        onOpen={setOpenModal}
                        ariaLabel="예금/적금 설명"
                      />
                    </div>
                    <span className="font-semibold text-slate-800">
                      {data.accumulated.deposit.toLocaleString()} 만원
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">ETF</span>
                      <InfoButton
                        modalKey="etf"
                        onOpen={setOpenModal}
                        ariaLabel="ETF 설명"
                      />
                    </div>
                    <span className="font-semibold">
                      {data.accumulated.etf.toLocaleString()} 만원
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">부동산 지분</span>
                      <InfoButton
                        modalKey="realestate"
                        onOpen={setOpenModal}
                        ariaLabel="부동산 지분 설명"
                      />
                    </div>
                    <span className="font-semibold">
                      {data.accumulated.realEstate.toLocaleString()} 만원
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">전월세 보증금</span>
                      <InfoButton
                        modalKey="housingDeposit"
                        onOpen={setOpenModal}
                        ariaLabel="전월세 보증금 설명"
                      />
                    </div>
                    <span className="font-semibold">
                      {data.accumulated.housingDeposit.toLocaleString()} 만원
                    </span>
                  </div>
                  {data.age == 60 && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">퇴직 연금 수령액</span>
                      <InfoButton
                        modalKey="retire"
                        onOpen={setOpenModal}
                        ariaLabel="퇴직 연금 수령액 설명"
                      />
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
                      <InfoButton
                        modalKey="mortgage"
                        onOpen={setOpenModal}
                        ariaLabel="주담대 원금 설명"
                      />
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
