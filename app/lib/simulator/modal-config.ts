export type InfoModalKey =
  | 'living'
  | 'child'
  | 'salary'
  | 'tax'
  | 'marriage'
  | 'mortgage'
  | 'realestate'
  | 'retire'
  | 'saving'
  | 'etf'
  | 'housingDeposit'

export type InfoModalType = InfoModalKey | null

export const modalTitleMap: Record<InfoModalKey, string> = {
  living: '생활비는 어떻게 계산하나요?',
  child: '자녀 양육비는 어떻게 계산하나요?',
  salary: '연봉 상승률은 어떻게 정해지나요?',
  tax: '4대보험 및 세금은 어떻게 계산하나요?',
  marriage: '결혼 비용은 어떻게 계산하나요?',
  mortgage: '집값과 대출은 어떻게 계산하나요?',
  realestate: '부동산 지분이란?',
  retire: '퇴직 연금 수령액은 어떻게 계산하나요?',
  saving: '예금/적금은 어떻게 계산하나요?',
  etf: 'ETF는 어떻게 계산하나요?',
  housingDeposit: '전월세 보증금의 함정',
}

import LivingExpenseModal from '@/app/ui/simulator/modal/living-expense-modal'
import ChildExpenseModal from '@/app/ui/simulator/modal/child-expense-modal'
import SalaryIncreaseRateModal from '@/app/ui/simulator/modal/salary-raise-modal'
import TaxModal from '@/app/ui/simulator/modal/tax-modal'
import MarriageExpenseModal from '@/app/ui/simulator/modal/marriage-expense-modal'
import MortgageLoanModal from '@/app/ui/simulator/modal/mortgage-loan-modal'
import RealEstateEquityModal from '@/app/ui/simulator/modal/real-estate-equity-modal'
import RetirementPensionModal from '@/app/ui/simulator/modal/real-estate-equity-modal'
import DepositSavingModal from '@/app/ui/simulator/modal/deposit-saving-modal'
import EtfInvestmentModal from '@/app/ui/simulator/modal/etf-investment-modal'
import JeonseModal from '@/app/ui/simulator/modal/jeonse-modal'

export const modalComponentMap: Record<
  InfoModalKey,
  React.ComponentType
> = {
  living: LivingExpenseModal,
  child: ChildExpenseModal,
  salary: SalaryIncreaseRateModal,
  tax: TaxModal,
  marriage: MarriageExpenseModal,
  mortgage: MortgageLoanModal,
  realestate: RealEstateEquityModal,
  retire: RetirementPensionModal,
  saving: DepositSavingModal,
  etf: EtfInvestmentModal,
  housingDeposit: JeonseModal,
}
