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
      <div className="flex items-center justify-center">
        <div
          className={`w-40 h-4 rounded-full transition-all duration-300 ${
            riskLevel === 0
              ? 'bg-green-400'
              : riskLevel === 1
              ? 'bg-yellow-400'
              : 'bg-red-500'
          }`}
        />
      </div>

      {/* 라벨 + i */}
      <div className="flex items-center justify-center gap-1">
        <span className="text-sm">재정 압박 지수</span>

        <button
          onClick={() => setOpen(true)}
          aria-label="재정 압박 지수 설명"
          className="
            w-4 h-4 flex items-center justify-center
            rounded-full border border-gray-300
            text-[10px] text-gray-500
            hover:bg-gray-100
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
