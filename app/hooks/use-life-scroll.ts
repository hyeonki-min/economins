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

    let startY = 0
    let acc = 0
    const THRESHOLD = 24

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      startY = e.touches[0].clientY
      acc = 0
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.cancelable) return
      if (e.touches.length !== 1) return

      const y = e.touches[0].clientY
      const dy = y - startY
      startY = y
      acc += dy

      if (Math.abs(acc) >= THRESHOLD) {
        e.preventDefault()
        step(acc < 0 ? 1 : -1)
        acc = 0
      }
    }

    el.addEventListener("wheel", handleWheel, { passive: false })
    el.addEventListener("touchstart", handleTouchStart, { passive: true })
    el.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      el.removeEventListener("wheel", handleWheel)
      el.removeEventListener("touchstart", handleTouchStart)
      el.removeEventListener("touchmove", handleTouchMove)
    }
  }, [ref, onChange, min, max])
}
