export default function MarriageExpenseModal() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700 leading-relaxed">
        결혼 비용은 한국소비자원 조사에서 제시한
        <span className="font-medium"> 평균 결혼 지출 2,160만원</span>을 기준으로,
        부부가 비용을 나누어 부담하는 구조를 가정해
        <span className="font-medium"> 1인당 1,080만원</span>을 적용했습니다.
      </p>

      <p className="text-sm text-slate-700 leading-relaxed">
        이 금액은 예식, 혼수, 신혼여행 등을 모두 포함한
        <span className="font-medium"> 일회성 평균 지출</span>을 단순화한 값이며,
        결혼이 이루어지는 해당 나이 1년 동안 나눠 부담한다고 가정합니다.
      </p>

      <p className="text-xs text-slate-500 leading-relaxed">
        ※ 개인의 실제 결혼 비용을 예측하기보다는,
        결혼이라는 생애 이벤트가 재무 흐름에 미치는 영향을
        평균적인 수준에서 반영하기 위한 가정입니다.
      </p>
    </div>
  )
}
