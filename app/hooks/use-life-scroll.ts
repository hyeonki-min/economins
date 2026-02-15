"use client"

import { useEffect } from "react"

export function useLifeScroll(
  ref: React.RefObject<HTMLElement | null>,
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

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("input, textarea")) return
      if (Math.abs(e.deltaY) < 10) return

      e.preventDefault()
      step(e.deltaY > 0 ? 1 : -1)
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      const delta = scrollY - prevScrollY

      if (Math.abs(delta) >= 40) {
        step(delta > 0 ? 1 : -1)
        prevScrollY = scrollY
      }
    }

    const el = ref.current

    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      if (el) {
        el.removeEventListener("wheel", handleWheel)
      }
      window.removeEventListener("scroll", handleScroll)
    }
  }, [ref, onChange, min, max])
}
