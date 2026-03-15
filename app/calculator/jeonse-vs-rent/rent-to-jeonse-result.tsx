import { Card, ResultRow } from "@/app/ui/calculator/component"

type Props = {
  deposit: number
  monthlyRent: number
  result: any
}

export default function RentToJeonseResult({
  deposit,
  monthlyRent,
  result,
}: Props) {
  return (
    <>

      <Card title="전환 결과">

        <ResultRow
          label="현재 월세 보증금"
          value={`${deposit.toLocaleString()}원`}
        />

        <ResultRow
          label="현재 월세"
          value={`${Math.round(monthlyRent).toLocaleString()}원`}
        />

        <ResultRow
          label="전세 환산 금액"
          value={`${Math.round(
            result.convertedJeonse
          ).toLocaleString()}원`}
        />

        <ResultRow
          label="필요 전세 대출 금액"
          value={`${result.requiredLoan.toLocaleString()}원`}
        />
        <ResultRow
          label="월 대출 이자"
          value={`${Math.round(result.loanInterest).toLocaleString()}원`}
        />
      </Card>

      <Card title="월세 절약 효과">

        <ResultRow
          label="월 절약 금액"
          value={`${Math.round(
            monthlyRent - result.loanInterest
          ).toLocaleString()}원`}
        />

        <ResultRow
          label="연 절약 금액"
          value={`${Math.round(
            (monthlyRent - result.loanInterest) * 12
          ).toLocaleString()}원`}
        />
      </Card>

      <Card title="투자 분석">

        <ResultRow
          label="월 투자 가능 금액"
          value={`${Math.round(
            result.monthlyInvestable
          ).toLocaleString()}원`}
        />

        <ResultRow
          label="거주기간 투자 수익"
          value={`${Math.round(
            result.savingInvestmentProfit
          ).toLocaleString()}원`}
        />

      </Card>

      <Card title="최종 분석">

        <ResultRow
            label="거주기간 투자 자산"
            value={`${Math.round(
            result.investmentFutureValue
            ).toLocaleString()}원`}
        />

        <ResultRow
            label="거주기간 이자 비용"
            value={`${Math.round(
            result.totalHousingCost
            ).toLocaleString()}원`}
        />

        <ResultRow
            label="순 자산 증가"
            value={`${Math.round(
            result.rentToJeonseAssetIncrease
            ).toLocaleString()}원`}
        />

      </Card>

    </>
  )
}