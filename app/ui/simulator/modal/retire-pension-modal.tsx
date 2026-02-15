export default function RetirementPensionModal() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700 leading-relaxed">
        퇴직연금은 <span className="font-medium">은퇴 전까지 매년 적립</span>되고,
        은퇴 시점에 <span className="font-medium">누적 자산</span>으로 계산됩니다.
      </p>

      <p className="text-sm text-slate-700 leading-relaxed">
        매년 연봉을 기준으로 한 금액이 적립되며,
        투자 성향에 따라 <span className="font-medium">적금과 ETF로 단순 분산</span>됩니다.
      </p>

      <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700 space-y-1">
        <div className="flex justify-between">
          <span className="text-slate-500">안전형</span>
          <span className="font-medium">적금 7 : ETF 3</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">중립형</span>
          <span className="font-medium">적금 5 : ETF 5</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">적극형</span>
          <span className="font-medium">적금 3 : ETF 7</span>
        </div>
      </div>
      
      <p className="text-xs text-slate-500 leading-relaxed">
        ※ 투자 성향에 따른 비율은 이해를 돕기 위한
        <span className="font-medium">단순 가정</span>이며,
        실제 퇴직연금 상품의 자산 배분과는 다를 수 있습니다.
      </p>
    </div>
  )
}
