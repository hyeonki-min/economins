export default function RealEstateEquityModal() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700 leading-relaxed">
        부동산 자산은 집값 전체가 아니라,
        <span className="font-medium"> 집값에서 남은 대출을 뺀 지분</span>만
        순자산으로 계산합니다.
      </p>

      <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700 space-y-1">
        <div className="flex justify-between">
          <span className="text-slate-500">부동산 지분</span>
          <span className="font-medium">집값 − 대출 잔액</span>
        </div>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed">
        집값은 장기 평균을 가정해
        <span className="font-medium"> 연 6% 상승</span>으로 계산했습니다.
        이는 과거 상승기와 조정기를 함께 고려한
        <span className="font-medium"> 명목 기준 평균 가정</span>입니다.
      </p>

      <p className="text-xs text-slate-500 leading-relaxed">
        ※ 실제 주택 가격은 지역·시기에 따라 크게 달라질 수 있습니다.
      </p>
    </div>
  )
}
