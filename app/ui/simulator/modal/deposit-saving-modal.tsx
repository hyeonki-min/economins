export default function DepositSavingModal() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700 leading-relaxed">
        예금·적금은 <span className="font-medium">원금 보존 성격의 자산</span>으로,
        안정적인 현금 흐름을 만들기 위한 용도로 계산됩니다.
      </p>

      <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700 space-y-1">
        <div className="flex justify-between">
          <span className="text-slate-500">연평균 금리</span>
          <span className="font-medium">2.8%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">운용 방식</span>
          <span className="font-medium">연 단위 복리</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        ※ 이 금리는 장기 평균을 단순화한 가정이며,
        실제 예·적금 상품의 금리와는 차이가 있을 수 있습니다.
      </p>
    </div>
  )
}
