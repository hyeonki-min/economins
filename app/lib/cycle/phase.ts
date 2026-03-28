import { XYPoint } from "@/app/lib/definitions"


function toNumber(value: string | number): number {
  if (typeof value === "number") return value

  const parsed = Number(value)

  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid number value: ${value}`)
  }

  return parsed
}

function getLatest(data: XYPoint[]) {
  return data[data.length - 1]
}

function getPrev(data: XYPoint[]) {
  return data[data.length - 2]
}

function getValue(point: XYPoint): number {
  return toNumber(point.y)
}

function getTrend(data: XYPoint[]): number {
  if (data.length < 2) return 0

  return getValue(getLatest(data)) - getValue(getPrev(data))
}

export type Phase = "boom" | "stagflation" | "recession" | "goldilocks"

export function getPhaseAdvanced(
  cpiData: XYPoint[],
  cliData: XYPoint[]
): Phase {

  // 🔥 CPI → YoY 변환
  const cpi = getYoY(cpiData)

  // CLI는 그대로 사용
  const cli = getValue(getLatest(cliData))

  // 🔥 Trend도 동일 기준으로 맞춤
  const cpiTrend = getYoYTrend(cpiData)
  const cliTrend = getTrend(cliData)

  const inflationHigh = cpi > 3
  const growthHigh = cli > 100

  // 회복 초기 (저성장 + 저물가 + 상승 전환)
  if (!growthHigh && !inflationHigh && cliTrend > 0) {
    return "recession"
  }

  // 과열 진입 (고성장 + 고물가 + 물가 상승 중)
  if (growthHigh && inflationHigh && cpiTrend > 0) {
    return "boom"
  }

  // 기본 4분면
  if (growthHigh && inflationHigh) return "boom"
  if (!growthHigh && inflationHigh) return "stagflation"
  if (!growthHigh && !inflationHigh) return "recession"
  return "goldilocks"
}

export function assertData(data: XYPoint[], name: string) {
  if (!data || data.length === 0) {
    throw new Error(`${name} data is empty`)
  }
}

function getMinMax(data: XYPoint[]) {
  const values = data.map(d => toNumber(d.y))
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  }
}

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v))
}

function getYoY(data: XYPoint[]): number {
  if (data.length < 13) return 0

  const latest = toNumber(data[data.length - 1].y)
  const prevYear = toNumber(data[data.length - 13].y)

  return ((latest - prevYear) / prevYear) * 100
}

function getYoYTrend(data: XYPoint[]): number {
  if (data.length < 14) return 0

  const currentYoY = getYoY(data)

  // 한 달 전 YoY 계산
  const prevData = data.slice(0, -1)
  const prevYoY = getYoY(prevData)

  return currentYoY - prevYoY
}

function smooth(v: number) {
  return Math.pow(v, 0.8)
}

export function getDotPosition(
  cpiData: XYPoint[],
  cliData: XYPoint[]
) {
  const cpi = getYoY(cpiData)
  const cli = toNumber(cliData[cliData.length - 1].y)

  // 🔥 기본 기준 (핵심)
  let CPI_MIN = 1.5
  let CPI_MAX = 4.0

  // 🔥 데이터 기반 보정 (optional)
  const cpiYoYs = cpiData.map((_, i, arr) => {
    if (i < 12) return null
    return getYoY(arr.slice(0, i + 1))
  }).filter(v => v !== null) as number[]

  if (cpiYoYs.length > 0) {
    const min = Math.min(...cpiYoYs)
    const max = Math.max(...cpiYoYs)

    // extreme 대응 (완만하게 확장)
    CPI_MIN = Math.min(CPI_MIN, min)
    CPI_MAX = Math.max(CPI_MAX, max)
  }
  const CLI_CENTER = 100
  const CLI_RANGE = 2

  let x = clamp(0.5 + (cli - CLI_CENTER) / CLI_RANGE)
  
  let y = clamp((cpi - CPI_MIN) / (CPI_MAX - CPI_MIN))

  x = smooth(x)
  y = smooth(y)

  return {
    left: `${x * 100}%`,
    top: `${100 - y * 100}%`,
  }
}

export function getSummary(
  cpiData: XYPoint[],
  cliData: XYPoint[]
) {
  const cpi = getYoY(cpiData)
  const cli = toNumber(cliData[cliData.length - 1].y)

  const inflationLabel = cpi > 3 ? "고물가" : "저물가"
  const growthLabel = cli > 100 ? "고성장" : "저성장"

  return {
    cpi,
    cli,
    inflationLabel,
    growthLabel,
  }
}