import { Card, ResultRow } from "@/app/ui/calculator/component"

type Props = {
  deposit: number
  monthlyRent: number
  futureMonthlyRent: number
  result: any
}

export default function JeonseToRentResult({
  deposit,
  monthlyRent,
  futureMonthlyRent,
  result,
}: Props) {
  return (
    <>

      <Card title="전환 결과">
        <ResultRow
          label="예상 월세 보증금"
          value={`${deposit.toLocaleString()}원`}
        />

        <ResultRow
          label="예상 월세"
          value={`${Math.round(monthlyRent).toLocaleString()}원`}
        />
      </Card>

      <Card title="투자 분석">
        <ResultRow
          label="보증금 투자 가능 금액"
          value={`${result.investable.toLocaleString()}원`}
        />

        <ResultRow
          label="보증금 투자 수익 (연)"
          value={`${Math.round(
            result.yearlyDepositReturn
          ).toLocaleString()}원`}
        />

        <ResultRow
          label="저축 투자 수익"
          value={`${Math.round(
            result.savingInvestmentProfit
          ).toLocaleString()}원`}
        />

        <ResultRow
          label="거주기간 투자 자산"
          value={`${Math.round(
            result.investmentFutureValue
          ).toLocaleString()}원`}
        />
      </Card>

      <Card title="비용 및 미래">
        <ResultRow
          label="연 월세 지출"
          value={`${Math.round(
            result.yearlyMonthlyRent
          ).toLocaleString()}원`}
        />

        <ResultRow
          label="연 대출 이자"
          value={`${Math.round(
            result.loanInterest * 12
          ).toLocaleString()}원`}
        />

        <ResultRow
          label="재계약 예상 월세"
          value={`${Math.round(
            futureMonthlyRent
          ).toLocaleString()}원`}
        />
      </Card>

      <Card title="최종 분석">
        <ResultRow
            label="예상 투자 자산"
            value={`${Math.round(
            result.totalInvestmentValue
            ).toLocaleString()}원`}
        />

        <ResultRow
          label="거주기간 주거 비용 (월세 + 이자)"
          value={`${Math.round(
            result.totalHousingCost
          ).toLocaleString()}원`}
        />

        <ResultRow
          label="순 자산 증가"
          value={`${Math.round(
            result.jeonseToRentAssetIncrease
          ).toLocaleString()}원`}
        />
      </Card>

      {result.shortage > 0 ? (
        <div className="text-red-500 font-semibold mt-4">
          ⚠ 보증금이 {Math.round(result.shortage).toLocaleString()}원 부족합니다.
        </div>
      ) : (
        <div className="text-green-600 font-semibold mt-4">
          ✔ 충분히 준비 가능합니다.
        </div>
      )}

    </>
  )
}