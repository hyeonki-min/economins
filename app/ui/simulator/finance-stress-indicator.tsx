import { useState } from 'react';
import Modal from '@/app/ui/simulator/modal';

export function FinancialStressIndicator({
  riskLevel,
}: {
  riskLevel: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      {/* 바 */}
      <div className="flex items-center justify-center gap-2">
        {/* Risk Bar */}
        <div
          className={`w-40 h-4 rounded-full transition-all duration-300 ${
            riskLevel === 0
              ? 'bg-green-400'
              : riskLevel === 1
              ? 'bg-yellow-400'
              : 'bg-red-500'
          }`}
        />

        {/* Info Button */}
        <button
          onClick={() => setOpen(true)}
          aria-label="재정 압박 지수 설명"
          className="
            w-5 h-5
            flex items-center justify-center
            rounded-full
            border border-slate-300
            text-[11px] text-slate-500
            hover:bg-slate-100
            active:scale-90
            transition
            shrink-0
          "
        >
          i
        </button>
      </div>

      {/* 모달 */}
      {open && <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="재정 압박 지수"
      >
        <p className="text-sm text-slate-700 leading-relaxed">
          현재 소득 대비 <span className="font-medium text-slate-900">저축 여력</span>과{' '}
          <span className="font-medium text-slate-900">재정 성장 가능성</span>을
          기반으로 계산한 지표입니다.
          <br />
          값이 높을수록 장기적인 재정 스트레스가 커질 수 있습니다.
        </p>

        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>
              <b>낮음</b> — 재정 구조가 안정적
            </span>
          </li>

          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>
              <b>보통</b> — 관리가 필요한 상태
            </span>
          </li>

          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>
              <b>높음</b> — 구조적 조정 필요
            </span>
          </li>
        </ul>
      </Modal>}
    </div>
  );
}
