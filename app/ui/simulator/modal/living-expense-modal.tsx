export default function LivingExpenseModal() {
  return (
    <div className="space-y-3">
        <p className="text-sm text-slate-700 leading-relaxed">
            생활비는 식비, 교통비, 여가비처럼
            개인의 선택에 따라 조절 가능한 지출을 의미합니다.
            이 시뮬레이터에서는 생활비가
            <span className="font-medium"> 자동으로 증가하지 않도록</span>
            설계되어 있습니다.
        </p>

        <p className="text-sm text-slate-700 leading-relaxed">
            대신 <span className="font-medium">연봉이 상승할 때만</span>,
            그 증가분의 일부가 생활비에 반영됩니다.
            소득이 늘어나면 생활 수준이 조금씩 올라가는
            현실적인 패턴을 단순화해 표현한 것입니다.
        </p>

        <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700 space-y-2">
            <div className="flex justify-between">
            <span className="text-slate-500">반영 기준</span>
            <span className="font-medium">연봉 상승 시</span>
            </div>
            <div className="flex justify-between">
            <span className="text-slate-500">증가 방식</span>
            <span className="font-medium">상승률 × 소비 탄력성</span>
            </div>
            <div className="flex justify-between">
            <span className="text-slate-500">자동 물가 반영</span>
            <span className="font-medium">적용하지 않음</span>
            </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed">
            소비 탄력성은 소득 수준에 따라 달라집니다.
            소득이 낮을수록 연봉 상승이 생활비 증가로
            더 크게 이어지고,
            소득이 높아질수록 생활비 증가 폭은
            점차 완만해지도록 설정되어 있습니다.
        </p>

        <p className="text-xs text-slate-500 leading-relaxed">
            ※ 이 방식은 단기 물가 변동을 반영하기보다는,
            소득 증가에 따라 생활 수준이 서서히 조정되는
            장기적인 소비 흐름을 표현하기 위한 가정입니다.
        </p>
    </div>
  )
}
