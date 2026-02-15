export default function SalaryIncreaseRateModal() {
    return (
        <div className="space-y-3">
            <p className="text-sm text-slate-700 leading-relaxed">
                연봉 상승률은 임의로 고정하지 않고, <span className="font-medium">현재 월 소득 수준</span>에 따라
                조금씩 달라지도록 설정했습니다.
            </p>

            <p className="text-sm text-slate-700 leading-relaxed">
                현실에서도 보통 소득이 낮을 때는 성장 여지가 더 크고,
                소득이 높아질수록 상승률이 완만해지는 경향이 있어서,
                그 흐름을 단순한 규칙으로 반영했습니다.
            </p>

            <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700 space-y-1">
                <div className="flex justify-between">
                <span className="text-slate-500">기준 월소득</span>
                <span className="font-medium">400만원</span>
                </div>
                <div className="flex justify-between">
                <span className="text-slate-500">분포의 폭(표준편차)</span>
                <span className="font-medium">150만원</span>
                </div>
                <div className="flex justify-between">
                <span className="text-slate-500">최소 상승률</span>
                <span className="font-medium">gMin</span>
                </div>
                <div className="flex justify-between">
                <span className="text-slate-500">최대 상승률</span>
                <span className="font-medium">gMax</span>
                </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
                계산은 <span className="font-medium">정규분포의 누적확률(Φ)</span>을 이용해서,
                “현재 소득이 평균보다 어느 정도 위치인지”를 점수처럼 만든 뒤,
                그 점수로 상승률 범위(gMin~gMax)를 보간하는 방식입니다.
            </p>

            <div className="rounded-lg bg-slate-50 p-3 text-xs font-mono text-slate-700 space-y-1">
                <p>z = (월소득 − 400) / 150</p>
                <p>w = 1 − Φ(z)  // 소득이 낮을수록 w가 커짐</p>
                <p>상승률 = gMin + (gMax − gMin) × w</p>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
                ※ 이 상승률은 개인의 실제 연봉 인상을 “예측”하려는 목적이 아니라,
                장기 재무 시뮬레이션에서 소득이 자연스럽게 성장하는 패턴을 만들기 위한 가정입니다.
            </p>
        </div>
    )
}