export default function TaxModal() {
    return (
         <div className="space-y-3">
            <p className="text-sm text-slate-700 leading-relaxed">
                월 실수령액은 연봉에서 <span className="font-medium">4대보험과 세금</span>을
                차감한 값으로 계산됩니다.
            </p>

            <p className="text-sm text-slate-700 leading-relaxed">
                다만 실제 제도는 공제 항목이 많고 개인별 차이가 크기 때문에,
                이 시뮬레이터에서는 <span className="font-medium">2026년 기준을 바탕으로 한
                단순화된 비율 모델</span>을 사용합니다.
            </p>

            <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700 space-y-1">
                <div className="flex justify-between">
                <span className="text-slate-500">연봉 3,000만원 이하</span>
                <span className="font-medium">실수령 약 89%</span>
                </div>
                <div className="flex justify-between">
                <span className="text-slate-500">연봉 3,000~6,000만원</span>
                <span className="font-medium">점진적 감소</span>
                </div>
                <div className="flex justify-between">
                <span className="text-slate-500">연봉 6,000~9,000만원</span>
                <span className="font-medium">실수령 약 83% → 77%</span>
                </div>
                <div className="flex justify-between">
                <span className="text-slate-500">연봉 1억 2천만원 이상</span>
                <span className="font-medium">실수령 약 74%</span>
                </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
                연봉이 높아질수록 건강보험, 국민연금, 소득세 부담이 함께 늘어나는 구조를
                반영해, <span className="font-medium">구간별로 실수령 비율이 완만하게 감소</span>
                하도록 설계했습니다.
            </p>

            <p className="text-xs text-slate-500 leading-relaxed">
                ※ 이 계산은 실제 급여명세서를 정확히 재현하기 위한 것이 아니라,
                장기 재무 시뮬레이션에서 세금 부담의 흐름을 현실적으로 반영하기 위한
                단순 모델입니다.
            </p>
        </div>
    )
}