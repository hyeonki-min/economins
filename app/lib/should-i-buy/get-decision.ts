import { IssueStatus, MarketIssue } from "@/app/lib/definitions"
import { formatDate, getLastDayOfMonth } from "@/app/lib/utils"

export function getDecision(market: "KR" | "US") {
  const year = new Date().getFullYear()

  const allIssues = getAllIssues(year)

  const todayIssues = getTodayIssues(market, allIssues)

  const score = calculateRiskScore(todayIssues)

  const status = deriveStatus(score)

  const primary = getPrimaryIssue(todayIssues)

  return {
    status,
    score,
    primaryEvent: primary,
    events: todayIssues,
  }
}


// ------------------
// 1. 네마녀의 날 (US)
// ------------------

function getQuadWitching(year: number): MarketIssue[] {
  const months = [2, 5, 8, 11]

  return months.map((m) => {
    let d = new Date(year, m, 1)
    let count = 0

    while (true) {
      if (d.getDay() === 5) {
        count++
        if (count === 3) break
      }
      d.setDate(d.getDate() + 1)
    }

    return {
      type: "QUAD_WITCHING",
      name: "네마녀의 날",
      level: "HIGH",
      date: formatDate(d),
      summary: "옵션·선물 동시 만기로 변동성 증가",
      market: "US",
      category: "STRUCTURAL",
    }
  })
}

// ------------------
// 2. 옵션 만기일 (US)
// ------------------

function getMonthlyOptionsExpiry(year: number): MarketIssue[] {
  const result: MarketIssue[] = []

  for (let m = 0; m < 12; m++) {
    let d = new Date(year, m, 1)
    let count = 0

    while (true) {
      if (d.getDay() === 5) {
        count++
        if (count === 3) break
      }
      d.setDate(d.getDate() + 1)
    }

    result.push({
      type: "OPTIONS_EXPIRY",
      name: "옵션 만기일",
      level: "MEDIUM",
      date: formatDate(d),
      summary: "옵션 만기로 단기 변동성 증가",
      market: "US",
      category: "STRUCTURAL",
    })
  }

  return result
}

// ------------------
// 3. 월말 (KR / US)
// ------------------

function getMonthEnd(year: number, market: "KR" | "US"): MarketIssue[] {
  const result: MarketIssue[] = []

  for (let m = 0; m < 12; m++) {
    const d = getLastDayOfMonth(year, m)

    result.push({
      type: "MONTH_END",
      name: "월말",
      level: "LOW",
      date: formatDate(d),
      summary: "기관 리밸런싱 가능성",
      market,
      category: "STRUCTURAL",
    })
  }

  return result
}

// ------------------
// 4. 분기말 (KR / US)
// ------------------

function getQuarterEnd(year: number, market: "KR" | "US"): MarketIssue[] {
  const months = [2, 5, 8, 11]

  return months.map((m) => {
    const d = getLastDayOfMonth(year, m)

    return {
      type: "QUARTER_END",
      name: "분기말",
      level: "MEDIUM",
      date: formatDate(d),
      summary: "펀드 리밸런싱 증가",
      market,
      category: "STRUCTURAL",
    }
  })
}

// ------------------
// 5. 연말 (KR / US)
// ------------------

function getLastTradingDayOfYear(year: number) {
  let d = new Date(year, 11, 31)

  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() - 1)
  }

  return d
}

function getYearEnd(year: number, market: "KR" | "US"): MarketIssue[] {
  if (market === "KR") {
    return [
      {
        type: "YEAR_END",
        name: "연말",
        level: "HIGH",
        date: `${year}-12-30`,
        summary: "연말 포트폴리오 조정",
        market,
        category: "STRUCTURAL",
      },
    ]
  }

  const d = getLastTradingDayOfYear(year)

  return [
    {
      type: "YEAR_END",
      name: "연말",
      level: "HIGH",
      date: formatDate(d),
      summary: "연말 포트폴리오 조정",
      market,
      category: "STRUCTURAL",
    },
  ]
}

// ------------------
// 6. 한국 만기일
// ------------------

function getKoreaExpiry(year: number): MarketIssue[] {
  const months = [2, 5, 8, 11]

  return months.map((m) => {
    let d = new Date(year, m, 1)
    let count = 0

    while (true) {
      if (d.getDay() === 4) {
        count++
        if (count === 2) break
      }
      d.setDate(d.getDate() + 1)
    }

    return {
      type: "KOREA_EXPIRY",
      name: "선물·옵션 만기일",
      level: "HIGH",
      date: formatDate(d),
      summary: "파생상품 동시 만기로 변동성 증가",
      market: "KR",
      category: "STRUCTURAL",
    }
  })
}

// ------------------
// 🔥 통합
// ------------------

export function generateStructuralIssues(year: number): MarketIssue[] {
  const us = [
    ...getQuadWitching(year),
    ...getMonthlyOptionsExpiry(year),
    ...getMonthEnd(year, "US"),
    ...getQuarterEnd(year, "US"),
    ...getYearEnd(year, "US"),
  ]

  const kr = [
    ...getKoreaExpiry(year),
    ...getMonthEnd(year, "KR"),
    ...getQuarterEnd(year, "KR"),
    ...getYearEnd(year, "KR"),
  ]

  // 🔥 네마녀 vs 옵션만기 중복 제거
  const filteredUS = us.filter((e) => {
    if (e.type !== "OPTIONS_EXPIRY") return true

    return !us.some(
      (q) =>
        q.type === "QUAD_WITCHING" &&
        q.date === e.date
    )
  })

  return [...filteredUS, ...kr]
}

export function getFOMC(year: number): MarketIssue[] {
  const raw = [
    `${year}-01-28`,
    `${year}-03-18`,
    `${year}-04-29`,
    `${year}-06-17`,
    `${year}-07-29`,
    `${year}-09-16`,
    `${year}-10-28`,
    `${year}-12-09`,
  ]

  return raw.map((d) => ({
    type: "FOMC",
    name: "FOMC 금리 발표",
    level: "HIGH",
    date: addDays(d, 1), // 🔥 핵심 (한국 기준 반영)
    summary: "미국 기준금리 발표로 시장 방향성 결정",
    market: "US",
    category: "MACRO",
  }))
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function getBOKRate(year: number): MarketIssue[] {
  const dates = [
    "01-15",
    "02-26",
    "04-10",
    "05-28",
    "07-16",
    "08-27",
    "10-22",
    "11-26",
  ]

  return dates.map((d) => ({
    type: "BOK_RATE",
    name: "한국 기준금리 발표",
    level: "HIGH",
    date: `${year}-${d}`,
    summary: "한국 기준금리 결정으로 금융시장 영향",
    market: "KR",
    category: "MACRO",
  }))
}

export function getMacroIssues(year: number): MarketIssue[] {
  return [
    ...getFOMC(year),
    ...getBOKRate(year),
  ]
}

export function getAllIssues(year: number): MarketIssue[] {
  return [
    ...generateStructuralIssues(year),
    ...getMacroIssues(year),
  ]
}

function getScore(issue: MarketIssue) {
  if (issue.category === "MACRO") return 100
  return {
    HIGH: 90,
    MEDIUM: 60,
    LOW: 30,
  }[issue.level]
}

export function getTodayIssues(
  market: "KR" | "US",
  issues: MarketIssue[]
) {
  const today = new Date()

  return issues
    .filter(
      (i) =>
        i.market === market &&
        isNear(i.date, today)
    )
    .sort((a, b) => {
      const order = { HIGH: 3, MEDIUM: 2, LOW: 1 }
      return order[b.level] - order[a.level]
    })
}

export function getPrimaryIssue(issues: MarketIssue[]) {
  return issues[0] ?? null
}

function isNear(date: string, today: Date) {
  const d = new Date(date)

  const diff =
    Math.abs(d.getTime() - today.getTime()) /
    (1000 * 60 * 60 * 24)

  return diff <= 1
}

const LEVEL_SCORE = {
  HIGH: 90,
  MEDIUM: 60,
  LOW: 30,
}

export function calculateRiskScore(issues: MarketIssue[]) {
  if (issues.length === 0) return 0

  // 가장 높은 리스크 기준 (단순 + 직관)
  return Math.max(...issues.map((i) => LEVEL_SCORE[i.level]))
}

export function deriveStatus(score: number): IssueStatus {
  if (score >= 80) return "WAIT"
  if (score >= 50) return "NEUTRAL"
  return "BUY"
}