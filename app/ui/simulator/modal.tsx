'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function Modal({
  open,
  onClose,
  title,
  children,
}: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose()
      }}
      className="
        fixed inset-0 z-[9999]
        bg-black/30 backdrop-blur-sm
        flex items-center justify-center
        px-4
      "
    >
      <div
        className="
          relative w-full max-w-sm
          bg-white
          rounded-xl
          shadow-[0_4px_12px_rgba(0,0,0,0.12)]
          p-6
        "
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="닫기"
          className="
            absolute top-3 right-3
            w-8 h-8
            flex items-center justify-center
            rounded-full
            text-slate-500
            hover:bg-slate-100
            active:bg-slate-200
            transition
          "
        >
          ✕
        </button>

        {title && (
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            {title}
          </h3>
        )}

        {children}
      </div>
    </div>,
    document.body
  )
}
