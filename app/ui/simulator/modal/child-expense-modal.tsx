import { ACADEMY_MONTHLY_COST, CHILD_BASE_MONTHLY_COST } from "@/app/lib/simulator/simple-finance-engine";

export default function ChildExpenseModal() {
    return (
        <div className="space-y-3">
            <p className="text-sm text-slate-700 leading-relaxed">
            자녀 관련 비용은 생활비 중에서도
            <span className="font-medium"> 조절이 어려운 필수 지출</span>에 가깝기 때문에,
            일반 소비와는 다른 방식으로 계산합니다.
            </p>

            <p className="text-sm text-slate-700 leading-relaxed">
            이 시뮬레이터에서는 자녀 비용을
            <span className="font-medium"> 기본 양육비</span>와
            <span className="font-medium"> 학원·교육비</span>로 나누어 가정하고,
            각각에 <span className="font-medium">인플레이션</span>을 반영합니다.
            </p>

            <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700 space-y-2">
            <div className="flex justify-between">
                <span className="text-slate-500">기본 양육비 (1인)</span>
                <span className="font-medium">월 평균 {CHILD_BASE_MONTHLY_COST}만원</span>
            </div>
            <div className="flex justify-between">
                <span className="text-slate-500">학원·교육비 (1인)</span>
                <span className="font-medium">월 평균 {ACADEMY_MONTHLY_COST}만원</span>
            </div>
            <div className="flex justify-between">
                <span className="text-slate-500">적용 인플레이션</span>
                <span className="font-medium">연 2% 가정</span>
            </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
            기본 양육비에는 식비, 의복, 교통, 생활용품 등
            자녀가 성장하면서 지속적으로 발생하는 비용이 포함됩니다.
            이러한 항목들은 소득이 변하더라도 쉽게 줄이기 어렵고,
            시간이 지날수록 물가 상승의 영향을 직접적으로 받는 편입니다.
            </p>

            <p className="text-sm text-slate-700 leading-relaxed">
            학원비는 중·고등학생 시기에 집중적으로 발생하는 비용으로,
            실제로는 교육 정책이나 지역에 따라 차이가 크지만,
            장기 시뮬레이션에서는
            <span className="font-medium"> 평균적인 1인당 교육비 수준</span>을 기준으로
            단순화해 반영합니다.
            </p>

            <p className="text-xs text-slate-500 leading-relaxed">
            ※ 이 계산은 실제 개별 가정의 지출을 정확히 예측하기보다는,
            자녀가 있는 가구에서 시간이 지날수록
            양육비 부담이 어떻게 변화하는지를
            <span className="font-medium">현실적인 방향으로 반영</span>하기 위한 가정입니다.
            </p>
        </div>
    )
}