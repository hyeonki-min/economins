export default function EtfInvestmentModal() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700 leading-relaxed">
        ETF는 <span className="font-medium">장기 성장을 목표로 하는 투자 자산</span>으로,
        단기 변동성은 있지만 시간이 지날수록
        자산 증가를 기대할 수 있는 성격의 자산입니다.
      </p>

      <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700 space-y-1">
        <div className="flex justify-between">
          <span className="text-slate-500">연평균 수익률</span>
          <span className="font-medium">9%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">운용 가정</span>
          <span className="font-medium">장기 평균 복리</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        ※ 연 9% 수익률은 글로벌 주식 ETF의
        <span className="font-medium">장기 평균을 단순화한 가정</span>이며,
        실제 수익률은 시장 상황에 따라 크게 달라질 수 있습니다.
      </p>
    </div>
  )
}
