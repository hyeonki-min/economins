import { useEffect } from "react"

export function useLifeSwipe(
  ref: React.RefObject<HTMLElement | null>,
  onChange: (updater: (prev: number) => number) => void,
  min: number,
  max: number
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    let startX = 0
    let startY = 0
    let accX = 0
    let isHorizontal: boolean | null = null
    let last = 0

    const THRESHOLD = 32

    const step = (dir: 1 | -1) => {
      const now = Date.now()
      if (now - last < 80) return
      last = now

      onChange(prev => {
        const next = prev + dir
        return Math.min(max, Math.max(min, next))
      })
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      accX = 0
      isHorizontal = null
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return

      const x = e.touches[0].clientX
      const y = e.touches[0].clientY

      const dx = x - startX
      const dy = y - startY

      // 방향 판별
      if (isHorizontal === null) {
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
          isHorizontal = Math.abs(dx) > Math.abs(dy)
        }
      }

      // 세로 스크롤은 허용
      if (isHorizontal === false) return

      startX = x
      accX += dx

      if (Math.abs(accX) >= THRESHOLD) {
        step(accX < 0 ? 1 : -1)
        accX = 0
      }
    }

    el.addEventListener("touchstart", handleTouchStart, { passive: true })
    el.addEventListener("touchmove", handleTouchMove, { passive: true })

    return () => {
      el.removeEventListener("touchstart", handleTouchStart)
      el.removeEventListener("touchmove", handleTouchMove)
    }
  }, [ref, onChange, min, max])
}
