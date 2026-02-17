"use client"

import { useRef } from "react"

type AgeSwipeWrapperProps = {
  age: number
  min: number
  max: number
  onChange: (updater: (prev: number) => number) => void
  children: React.ReactNode
}

export function AgeSwipeWrapper({
  age,
  min,
  max,
  onChange,
  children,
}: AgeSwipeWrapperProps) {
  const startX = useRef(0)
  const startY = useRef(0)
  const accX = useRef(0)
  const isHorizontal = useRef<boolean | null>(null)
  const last = useRef(0)

  const THRESHOLD = 32

  const step = (dir: 1 | -1) => {
    const now = Date.now()
    if (now - last.current < 80) return
    last.current = now

    onChange(prev => {
      const next = prev + dir
      return Math.min(max, Math.max(min, next))
    })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return

    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
    accX.current = 0
    isHorizontal.current = null
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return

    const x = e.touches[0].clientX
    const y = e.touches[0].clientY

    const dx = x - startX.current
    const dy = y - startY.current

    // 방향 판별 (처음 한 번만)
    if (isHorizontal.current === null) {
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        isHorizontal.current = Math.abs(dx) > Math.abs(dy)
      }
    }

    // 세로 제스처면 그냥 스크롤 허용
    if (isHorizontal.current === false) return

    // 가로 제스처만 처리
    startX.current = x
    accX.current += dx

    if (Math.abs(accX.current) >= THRESHOLD) {
      step(accX.current < 0 ? 1 : -1)
      accX.current = 0
    }
  }

  return (
    <div
      className="block w-full touch-pan-y select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {children}
    </div>
  )
}
