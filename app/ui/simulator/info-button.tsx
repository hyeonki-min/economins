'use client'

import { InfoModalKey } from '@/app/lib/simulator/modal-config'

interface InfoButtonProps {
  modalKey: InfoModalKey
  onOpen: (key: InfoModalKey) => void
  ariaLabel: string
}

export default function InfoButton({
  modalKey,
  onOpen,
  ariaLabel,
}: InfoButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(modalKey)}
      className="
        text-slate-400
        hover:text-slate-600
        active:scale-95
        transition
      "
      aria-label={ariaLabel}
    >
      ⓘ
    </button>
  )
}
