"use client"

import { useEffect } from "react"

export function useLifeScroll(
  ref: React.RefObject<HTMLElement>,
  value: number,
  onChange: (updater: (prev: number) => number) => void,
  min: number,
  max: number
) {
  useEffect(() => {
    let last = 0
    let prevScrollY = window.scrollY

    const step = (dir: 1 | -1) => {
      const now = Date.now()
      if (now - last < 80) return
      last = now

      onChange(prev => {
        const next = prev + dir
        return Math.min(max, Math.max(min, next))
      })
    }

    // 🔵 wheel (왼쪽 영역에서만)
    const handleWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea")) return
      if (Math.abs(e.deltaY) < 10) return

      e.preventDefault()
      step(e.deltaY > 0 ? 1 : -1)
    }

    // 🔵 body scroll 기반
    const handleScroll = () => {
      const scrollY = window.scrollY
      const delta = scrollY - prevScrollY

      if (Math.abs(delta) < 40) return

      step(delta > 0 ? 1 : -1)
      prevScrollY = scrollY
    }

    const el = ref.current

    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (el) {
        el.removeEventListener("wheel", handleWheel)
      }
    }
  }, [ref, onChange, min, max])
}

