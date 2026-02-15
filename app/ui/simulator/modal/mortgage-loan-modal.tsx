export default function MortgageLoanModal() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700 leading-relaxed">
        주담대 가능 집값은 <span className="font-medium">DSR 40%</span>와
        <span className="font-medium"> 생애최초 LTV 70%</span> 가정을 기준으로,
        현재까지 모은 자산과 월 상환 가능액을 함께 고려해 계산합니다.
      </p>

      <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700 space-y-1">
        <div className="flex justify-between">
          <span className="text-slate-500">월 상환 한도</span>
          <span className="font-medium">min(월실수령×0.4, 월저축)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">집값(대출 기준)</span>
          <span className="font-medium">최대대출 ÷ 0.7</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">집값(현금 기준)</span>
          <span className="font-medium">보유자산 ÷ 0.3</span>
        </div>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed">
        최종 집값은 <span className="font-medium">“대출로 가능한 집값”</span>과
        <span className="font-medium">“현금으로 가능한 집값”</span> 중
        더 작은 값으로 정합니다. (무리한 가정 방지)
      </p>

      <div className="rounded-lg bg-slate-50 p-3 text-xs font-mono text-slate-700 space-y-1">
        <p>집값 = min(보유자산/0.3, 최대대출/0.7)</p>
        <p>대출 = 집값×0.7 / 필요현금 = 집값×0.3</p>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        대출 기간은 대출액 규모에 따라 10년(≤1억)·20년(≤2억)·30년(&gt;2억)으로 단순화했습니다.
      </p>
    </div>
  )
}
