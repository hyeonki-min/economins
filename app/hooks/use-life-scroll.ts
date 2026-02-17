"use client"

import { useEffect } from "react"

export function useLifeScroll(
  ref: React.RefObject<HTMLElement | null>,
  onChange: (updater: (prev: number) => number) => void,
  min: number,
  max: number
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    let last = 0

    const step = (dir: 1 | -1) => {
      const now = Date.now()
      if (now - last < 80) return
      last = now

      onChange(prev => {
        const next = prev + dir
        return Math.min(max, Math.max(min, next))
      })
    }

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 10) return
      e.preventDefault()
      step(e.deltaY > 0 ? 1 : -1)
    }

    // 🔥 wheel만 등록
    el.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      el.removeEventListener("wheel", handleWheel)
    }
  }, [ref, onChange, min, max])
}
