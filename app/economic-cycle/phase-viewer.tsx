"use client"

import { useState } from "react"
import { assertData, getPhaseAdvanced, getDotPosition, getSummary } from "@/app/lib/cycle/phase"
import { XYPointList } from "@/app/lib/definitions"
import Link from "next/link"

type PhaseKey = "goldilocks" | "recession" | "stagflation" | "boom"

const PHASES = {
  goldilocks: {
    label: "고성장·저물가",
    pos: { x: "75%", y: "75%" },
    macro: { rate: "금리 안정", liquidity: "유동성 충분" },
    assets: [
      { name: "주식", signal: "GOOD", reason: "이익 성장 + 낮은 할인율", href: "kospi" },
      { name: "채권", signal: "GOOD", reason: "금리 안정", href: "treasury-bond-korea-3" },
      { name: "원자재", signal: "BAD", reason: "인플레 압력 낮음", href: "oil" },
      { name: "금", signal: "BAD", reason: "헤지 필요성 감소", href: "gold" },
    ],
  },

  recession: {
    label: "저성장·저물가",
    pos: { x: "25%", y: "75%" },
    macro: { rate: "금리 하락", liquidity: "유동성 확대" },
    assets: [
      { name: "주식", signal: "MIXED", reason: "금리 하락 → 성장주 유리", href: "kospi" },
      { name: "채권", signal: "GOOD", reason: "금리 하락 → 가격 상승", href: "treasury-bond-korea-3" },
      { name: "원자재", signal: "BAD", reason: "수요 감소", href: "oil" },
      { name: "금", signal: "GOOD", reason: "안전자산 수요", href: "gold" },
    ],
  },

  stagflation: {
    label: "저성장·고물가",
    pos: { x: "25%", y: "25%" },
    macro: { rate: "금리 높음", liquidity: "유동성 부족" },
    assets: [
      { name: "주식", signal: "BAD", reason: "이익 감소 + 비용 증가", href: "kospi" },
      { name: "채권", signal: "BAD", reason: "금리 유지 부담", href: "treasury-bond-korea-3" },
      { name: "원자재", signal: "GOOD", reason: "공급 충격 + 인플레", href: "oil"  },
      { name: "금", signal: "GOOD", reason: "불확실성 헤지", href: "gold" },
    ],
  },

  boom: {
    label: "고성장·고물가",
    pos: { x: "75%", y: "25%" },
    macro: { rate: "금리 상승", liquidity: "유동성 축소" },
    assets: [
      { name: "주식", signal: "GOOD", reason: "실적 성장 유지", href: "kospi" },
      { name: "채권", signal: "BAD", reason: "금리 상승 → 가격 하락", href: "treasury-bond-korea-3" },
      { name: "원자재", signal: "GOOD", reason: "수요 증가 + 인플레", href: "oil" },
      { name: "금", signal: "GOOD", reason: "인플레 헤지", href: "gold" },
    ],
  },
} as const

function getColor(signal: string) {
  if (signal === "GOOD") return "text-red-600"
  if (signal === "BAD") return "text-blue-600"
  return "text-gray-600"
}

function getLabel(signal: string) {
  if (signal === "GOOD") return "유리"
  if (signal === "BAD") return "불리"
  return "중립"
}

export default function PhaseViewer({cpiData, cliData}: {cpiData: XYPointList, cliData: XYPointList}) {
  assertData(cpiData, "CPI")
  assertData(cliData, "CLI")

  const summary = getSummary(cpiData, cliData)
  const dataPhase = getPhaseAdvanced(cpiData, cliData)
  const position = getDotPosition(cpiData, cliData)

  // 👉 설명용 상태
  const [viewPhase, setViewPhase] = useState<PhaseKey>(dataPhase)
  const data = PHASES[viewPhase]
  return (
    <section className="py-10 flex flex-col items-center space-y-5">
      {/* 🔥 인터랙티브 4분면 */}
      <div className="relative w-[260px] aspect-square">

        {/* 배경 */}
        <div className="absolute inset-0 border rounded-xl bg-gray-50" />

        {/* 축 */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300" />

        {/* 클릭 영역 */}
        <div
          className="absolute top-0 left-0 w-1/2 h-1/2 cursor-pointer hover:bg-gray-200/40"
          onClick={() => setViewPhase("stagflation")}
        />
        <div
          className="absolute top-0 right-0 w-1/2 h-1/2 cursor-pointer hover:bg-gray-200/40"
          onClick={() => setViewPhase("boom")}
        />
        <div
          className="absolute bottom-0 left-0 w-1/2 h-1/2 cursor-pointer hover:bg-gray-200/40"
          onClick={() => setViewPhase("recession")}
        />
        <div
          className="absolute bottom-0 right-0 w-1/2 h-1/2 cursor-pointer hover:bg-gray-200/40"
          onClick={() => setViewPhase("goldilocks")}
        />
        {/* 🔴 실제 데이터 기반 위치 */}
        <div
          className="
            absolute w-4 h-4 rounded-full bg-red-500
            -translate-x-1/2 -translate-y-1/2
            shadow-[0_0_0_8px_rgba(239,68,68,0.15)]
            transition-all duration-700 ease-out
          "
          style={{
            left: position.left,
            top: position.top,
          }}
        />

        {/* 🔥 축 라벨 - 끝단 기준 */}

        {/* 위 */}
        <div className="
          absolute 
          top-1 left-1/2
          -translate-x-1/2
          text-[10px] sm:text-xs text-gray-500
        ">
          고물가 ↑
        </div>

        {/* 아래 */}
        <div className="
          absolute 
          bottom-1 left-1/2
          -translate-x-1/2
          text-[10px] sm:text-xs text-gray-500
        ">
          ↓ 저물가
        </div>

        {/* 왼쪽 */}
        <div className="
          absolute 
          left-1 top-1/2
          -translate-y-1/2
          text-[10px] sm:text-xs text-gray-500
        ">
          저성장
        </div>

        {/* 오른쪽 */}
        <div className="
          absolute 
          right-1 top-1/2
          -translate-y-1/2
          text-[10px] sm:text-xs text-gray-500
        ">
          고성장
        </div>
      </div>
      <div className="text-center">

          {/* 현재 국면 */}
          <h2 className="text-lg font-bold">
            {data.label}
          </h2>

          <div className="text-xs text-gray-500 mt-1">
            현재 경제: {PHASES[dataPhase].label}
          </div>

          <div className="mt-3 text-sm text-gray-600 space-y-2">

            {/* 핵심 */}
            <div>
              물가: <span className="font-semibold">{summary.cpi.toFixed(1)}%</span>
              {" "}({summary.inflationLabel})
            </div>

            <div>
              경기: <span className="font-semibold">{summary.cli.toFixed(1)}</span>
              {" "}({summary.growthLabel})
            </div>

            {/* 보조 */}
            <div className="flex gap-2 text-gray-500 text-xs pt-1">
              <span className="bg-gray-100 px-2 py-1 rounded">
                {data.macro.rate}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                {data.macro.liquidity}
              </span>
            </div>

          </div>
      </div>
      <div className="w-[260px]">
        {data.assets.map((a) => (
          <Link
            key={a.name}
            href={`/series/${a.href}`}
            className="
              block py-3 border-b last:border-none
              transition
              hover:bg-gray-50
            "
          >
            <div className="flex justify-between">
              <span>{a.name}</span>

              <span
                className={`text-sm font-semibold ${getColor(a.signal)}`}
              >
                {getLabel(a.signal)}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {a.reason}
            </p>
          </Link>
        ))}
      </div>

    </section>
  )
}