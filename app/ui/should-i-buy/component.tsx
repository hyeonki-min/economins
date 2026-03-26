
import { motion } from "framer-motion"
import { IssueStatus, MarketIssue } from "@/app/lib/definitions"

export function DecisionCircle({ status }: { status: IssueStatus }) {
  const config = {
    BUY: {
      label: "안정",
      gradient: ["#fb7185", "#ef4444"],
      glow: "rgba(239,68,68,0.25)",
      progress: 0.9,
    },
    NEUTRAL: {
      label: "보통",
      gradient: ["#d1d5db", "#9ca3af"],
      glow: "rgba(156,163,175,0.2)",
      progress: 0.65,
    },
    WAIT: {
      label: "변동성",
      gradient: ["#60a5fa", "#2563eb"],
      glow: "rgba(37,99,235,0.25)",
      progress: 0.4,
    },
  }

  const c = config[status]

  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - c.progress)

  return (
    <div className="relative w-56 h-56 mx-auto">
      {/* glow (CSS로 분리 → 선명함 유지) */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: `0 0 40px ${c.glow}`,
        }}
      />

      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 -rotate-90"
        style={{ transform: "translateZ(0)" }}
      >
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.gradient[0]} />
            <stop offset="100%" stopColor={c.gradient[1]} />
          </linearGradient>
        </defs>

        {/* background */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="12"
          fill="none"
        />

        {/* main ring */}
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </svg>

      {/* 관망일 때만 subtle breathing */}
      {status === "WAIT" && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* 텍스트 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          key={c.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-semibold tracking-tight text-gray-900"
        >
          {c.label}
        </motion.span>
      </div>
    </div>
  )
}

export function MarketInlineSelector({
  market,
  onChange,
}: {
  market: "KR" | "US"
  onChange: (v: "KR" | "US") => void
}) {
  return (
    <div className="text-center text-sm text-gray-500 mb-6">
      지금{" "}
      <button
        onClick={() => onChange(market === "KR" ? "US" : "KR")}
        className="font-semibold text-gray-900 underline underline-offset-2"
      >
        {market === "KR" ? "🇰🇷 한국" : "🇺🇸 미국"}
      </button>{" "}
      시장 기준으로 보면
    </div>
  )
}

export function PrimaryEvent({
  event,
  onClick,
}: {
  event: MarketIssue
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="mt-8 text-center cursor-pointer"
    >
      <div className="text-sm text-gray-400">
        오늘의 주요 이벤트
      </div>

      <div className="mt-2 text-lg font-semibold text-gray-800">
        🔥 {event.name}
      </div>

      <div className="text-sm text-gray-500 mt-1">
        {event.summary}
      </div>
    </div>
  )
}

export function BottomSheet({
  open,
  onClose,
  events,
}: {
  open: boolean
  onClose: () => void
  events: MarketIssue[]
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "100%" }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6"
      >
        <div className="text-lg font-bold mb-4">
          이벤트 상세
        </div>

        <div className="space-y-4">
          {events.map((e, i) => (
            <div key={i}>
              <div className="font-semibold">{e.name}</div>
              <div className="text-sm text-gray-500">
                {e.summary}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}