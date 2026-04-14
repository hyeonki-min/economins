"use client"

import { useMemo, useState } from "react"
import { MoneyInput } from "@/app/ui/calculator/component"

type PresetPortfolioKey =
  | "all-weather"
  | "buffett-90-10"
  | "bogle-3-fund"
  | "golden-butterfly"
  | "custom"

type AssetInput = {
  id: string
  name: string
  ticker: string
  weight: number
  price: number
  currentQty: number
}

type AllocationRow = AssetInput & {
  targetAmount: number
  targetQty: number
  actualAllocatedAmount: number
  remainAmount: number
  currentValue: number
  targetValueFromCurrent: number
  rebalanceDiff: number
  rebalanceAction: "BUY" | "SELL" | "HOLD"
  rebalanceQty: number
}

type PresetPortfolio = {
  key: PresetPortfolioKey
  name: string
  description: string
  assets: Omit<AssetInput, "currentQty">[]
}

const PRESET_PORTFOLIOS: PresetPortfolio[] = [
  {
    key: "all-weather",
    name: "레이 달리오 올웨더",
    description: "주식·장기채·중기채·금·원자재를 섞는 방어형 분산 포트폴리오",
    assets: [
      { id: "1", name: "미국 주식", ticker: "VTI", weight: 30, price: 350000 },
      { id: "2", name: "장기 국채", ticker: "TLT", weight: 40, price: 130000 },
      { id: "3", name: "중기 국채", ticker: "IEF", weight: 15, price: 150000 },
      { id: "4", name: "금", ticker: "GLD", weight: 7.5, price: 320000 },
      { id: "5", name: "원자재", ticker: "DBC", weight: 7.5, price: 35000 },
    ],
  },
  {
    key: "buffett-90-10",
    name: "워런 버핏 90/10",
    description: "미국 주식 90%, 단기 국채 10%의 단순 장기 투자형 포트폴리오",
    assets: [
      { id: "1", name: "미국 주식", ticker: "VOO", weight: 90, price: 680000 },
      { id: "2", name: "단기 국채", ticker: "SHY", weight: 10, price: 115000 },
    ],
  },
  {
    key: "bogle-3-fund",
    name: "보글 3펀드",
    description: "미국 주식·해외 주식·채권을 단순하게 나누는 고전 분산 포트폴리오",
    assets: [
      { id: "1", name: "미국 주식", ticker: "VTI", weight: 50, price: 350000 },
      { id: "2", name: "해외 주식", ticker: "VXUS", weight: 30, price: 85000 },
      { id: "3", name: "미국 채권", ticker: "BND", weight: 20, price: 98000 },
    ],
  },
  {
    key: "golden-butterfly",
    name: "골든 버터플라이",
    description: "주식·소형주·장기채·단기채·금을 균형 있게 나누는 포트폴리오",
    assets: [
      { id: "1", name: "미국 대형주", ticker: "VOO", weight: 20, price: 680000 },
      { id: "2", name: "미국 소형주", ticker: "IWM", weight: 20, price: 290000 },
      { id: "3", name: "장기 국채", ticker: "TLT", weight: 20, price: 130000 },
      { id: "4", name: "단기 국채", ticker: "SHY", weight: 20, price: 115000 },
      { id: "5", name: "금", ticker: "GLD", weight: 20, price: 320000 },
    ],
  },
]

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "0"
  return new Intl.NumberFormat("ko-KR").format(Math.round(value))
}

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return "₩0"
  return `₩${new Intl.NumberFormat("ko-KR").format(Math.round(value))}`
}

function createCustomAsset(): AssetInput {
  return {
    id: crypto.randomUUID(),
    name: "",
    ticker: "",
    weight: 0,
    price: 0,
    currentQty: 0,
  }
}

function normalizeWeights(assets: AssetInput[]): AssetInput[] {
  const total = assets.reduce((sum, asset) => sum + Number(asset.weight || 0), 0)
  if (total <= 0) return assets

  return assets.map((asset, index) => {
    if (index === assets.length - 1) {
      const accumulated = assets
        .slice(0, index)
        .reduce((sum, a) => sum + Math.round((Number(a.weight || 0) / total) * 10000) / 100, 0)

      return {
        ...asset,
        weight: Math.max(0, Math.round((100 - accumulated) * 100) / 100),
      }
    }

    return {
      ...asset,
      weight: Math.round(((Number(asset.weight || 0) / total) * 100) * 100) / 100,
    }
  })
}

function buildPresetAssets(key: PresetPortfolioKey): AssetInput[] {
  if (key === "custom") {
    return [
      {
        id: crypto.randomUUID(),
        name: "미국 주식",
        ticker: "VOO",
        weight: 60,
        price: 680000,
        currentQty: 0,
      },
      {
        id: crypto.randomUUID(),
        name: "미국 채권",
        ticker: "BND",
        weight: 40,
        price: 98000,
        currentQty: 0,
      },
    ]
  }

  const preset = PRESET_PORTFOLIOS.find((item) => item.key === key)
  if (!preset) return []

  return preset.assets.map((asset) => ({
    ...asset,
    currentQty: 0,
  }))
}

function calculateRows(totalAmount: number, assets: AssetInput[]): AllocationRow[] {
  const totalPortfolioValue = assets.reduce(
    (sum, asset) => sum + Number(asset.currentQty || 0) * Number(asset.price || 0),
    0,
  )

  return assets.map((asset) => {
    const weight = Number(asset.weight || 0)
    const price = Number(asset.price || 0)
    const currentQty = Number(asset.currentQty || 0)
    const targetAmount = (totalAmount * weight) / 100
    const targetQty = price > 0 ? Math.floor(targetAmount / price) : 0
    const actualAllocatedAmount = targetQty * price
    const remainAmount = Math.max(0, targetAmount - actualAllocatedAmount)
    const currentValue = currentQty * price
    const targetValueFromCurrent = (totalPortfolioValue * weight) / 100
    const rebalanceDiff = targetValueFromCurrent - currentValue
    const absDiff = Math.abs(rebalanceDiff)
    const rebalanceQty = price > 0 ? Math.floor(absDiff / price) : 0

    let rebalanceAction: "BUY" | "SELL" | "HOLD" = "HOLD"
    if (rebalanceDiff > 0) rebalanceAction = "BUY"
    if (rebalanceDiff < 0) rebalanceAction = "SELL"
    if (rebalanceQty === 0) rebalanceAction = "HOLD"

    return {
      ...asset,
      targetAmount,
      targetQty,
      actualAllocatedAmount,
      remainAmount,
      currentValue,
      targetValueFromCurrent,
      rebalanceDiff,
      rebalanceAction,
      rebalanceQty,
    }
  })
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-gray-400"
    />
  )
}

function Card({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 md:text-xl">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-relaxed text-gray-500">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}

export default function PortfolioClient() {
  const [selectedPreset, setSelectedPreset] = useState<PresetPortfolioKey>("all-weather")
  const [totalAmount, setTotalAmount] = useState<number>(10000000)
  const [includeCurrentHoldings, setIncludeCurrentHoldings] = useState(false)
  const [assets, setAssets] = useState<AssetInput[]>(() => buildPresetAssets("all-weather"))

  const parsedTotalAmount = Number(totalAmount || 0)
  const totalWeight = useMemo(
    () => assets.reduce((sum, asset) => sum + Number(asset.weight || 0), 0),
    [assets],
  )

  const rows = useMemo(() => calculateRows(parsedTotalAmount, assets), [parsedTotalAmount, assets])

  const summary = useMemo(() => {
    const targetTotal = rows.reduce((sum, row) => sum + row.targetAmount, 0)
    const allocatedTotal = rows.reduce((sum, row) => sum + row.actualAllocatedAmount, 0)
    const remainTotal = rows.reduce((sum, row) => sum + row.remainAmount, 0)
    const currentTotal = rows.reduce((sum, row) => sum + row.currentValue, 0)
    const buyAmount = rows
      .filter((row) => row.rebalanceAction === "BUY")
      .reduce((sum, row) => sum + Math.max(0, row.rebalanceDiff), 0)
    const sellAmount = rows
      .filter((row) => row.rebalanceAction === "SELL")
      .reduce((sum, row) => sum + Math.abs(Math.min(0, row.rebalanceDiff)), 0)

    return {
      targetTotal,
      allocatedTotal,
      remainTotal,
      currentTotal,
      buyAmount,
      sellAmount,
    }
  }, [rows])

  const handlePresetChange = (key: PresetPortfolioKey) => {
    setSelectedPreset(key)
    setAssets(buildPresetAssets(key))
  }

  const updateAsset = (id: string, patch: Partial<AssetInput>) => {
    setAssets((prev) => prev.map((asset) => (asset.id === id ? { ...asset, ...patch } : asset)))
  }

  const addAsset = () => {
    setAssets((prev) => [...prev, createCustomAsset()])
  }

  const removeAsset = (id: string) => {
    setAssets((prev) => (prev.length <= 1 ? prev : prev.filter((asset) => asset.id !== id)))
  }

  const normalize = () => {
    setAssets((prev) => normalizeWeights(prev))
  }

  const selectedPresetMeta = PRESET_PORTFOLIOS.find((item) => item.key === selectedPreset)

  return (
      <>
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <Card
              title="기본 입력"
              description="총 투자금을 먼저 설정합니다."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">총 투자금액</label>
                  <MoneyInput
                    value={totalAmount}
                    onChange={setTotalAmount}
                  />
                </div>
              </div>
            </Card>

            <Card
              title="포트폴리오 선택"
              description="프리셋을 고르거나 커스텀 포트폴리오로 직접 구성할 수 있습니다."
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {PRESET_PORTFOLIOS.map((preset) => {
                  const active = preset.key === selectedPreset
                  return (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => handlePresetChange(preset.key)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-sm font-semibold">{preset.name}</div>
                      <div className={`mt-2 text-xs leading-relaxed ${active ? "text-gray-200" : "text-gray-500"}`}>
                        {preset.description}
                      </div>
                    </button>
                  )
                })}

                <button
                  type="button"
                  onClick={() => handlePresetChange("custom")}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedPreset === "custom"
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="text-sm font-semibold">커스텀 포트폴리오</div>
                  <div className={`mt-2 text-xs leading-relaxed ${selectedPreset === "custom" ? "text-gray-200" : "text-gray-500"}`}>
                    자산명, 티커, 비중, 가격, 현재 수량까지 직접 입력합니다.
                  </div>
                </button>
              </div>

              {selectedPresetMeta ? (
                <div className="mt-4 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  {selectedPresetMeta.description}
                </div>
              ) : null}
            </Card>

            <Card
              title="자산 구성"
              description="비중 합계는 100%가 가장 이상적입니다. 필요하면 자동 정규화할 수 있습니다."
            >
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={addAsset}
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                >
                  자산 추가
                </button>
                <button
                  type="button"
                  onClick={normalize}
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                >
                  비중 100으로 자동 맞춤
                </button>
                <div className={`text-sm font-medium ${Math.abs(totalWeight - 100) < 0.001 ? "text-emerald-600" : "text-amber-600"}`}>
                  현재 비중 합계: {formatNumber(totalWeight)}%
                </div>
              </div>

              <div className="space-y-3">
                {assets.map((asset, index) => (
                  <div key={asset.id} className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-sm font-semibold text-gray-900">자산 {index + 1}</div>
                      <button
                        type="button"
                        onClick={() => removeAsset(asset.id)}
                        className="text-sm text-gray-500 transition hover:text-gray-900"
                      >
                        삭제
                      </button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <label className="mb-2 block text-sm text-gray-600">자산명</label>
                        <Input
                          value={asset.name}
                          onChange={(value) => updateAsset(asset.id, { name: value })}
                          placeholder="예: 미국 주식"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-gray-600">티커</label>
                        <Input
                          value={asset.ticker}
                          onChange={(value) => updateAsset(asset.id, { ticker: value.toUpperCase() })}
                          placeholder="예: VOO"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-gray-600">비중(%)</label>
                        <Input
                          type="number"
                          value={asset.weight}
                          onChange={(value) => updateAsset(asset.id, { weight: Number(value || 0) })}
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-gray-600">현재 가격</label>
                        <MoneyInput 
                            value={asset.price}
                            onChange={(value) => updateAsset(asset.id, { price: Number(value || 0) })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card
              title="요약"
              description="목표 금액, 실제 매수 가능 금액, 남는 금액을 요약합니다."
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="text-sm text-gray-500">목표 배분 금액</div>
                  <div className="mt-2 text-xl font-semibold text-gray-900">{formatMoney(summary.targetTotal)}</div>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="text-sm text-gray-500">실제 매수 가능 금액</div>
                  <div className="mt-2 text-xl font-semibold text-gray-900">{formatMoney(summary.allocatedTotal)}</div>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="text-sm text-gray-500">남는 금액</div>
                  <div className="mt-2 text-xl font-semibold text-gray-900">{formatMoney(summary.remainTotal)}</div>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="text-sm text-gray-500">현재 보유 평가금액</div>
                  <div className="mt-2 text-xl font-semibold text-gray-900">{formatMoney(summary.currentTotal)}</div>
                </div>
              </div>
            </Card>

            <Card
              title="목표 배분 결과"
              description="총 투자금 기준으로 자산별 목표 금액과 실제 매수 가능한 수량을 계산합니다."
            >
              <div className="space-y-3">
                {rows.map((row) => (
                  <div key={row.id} className="rounded-3xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold text-gray-900">
                          {row.name || "이름 없는 자산"}
                          {row.ticker ? <span className="ml-2 text-sm font-medium text-gray-500">{row.ticker}</span> : null}
                        </div>
                        <p className="mt-1 text-sm text-gray-500">목표 비중 {formatNumber(row.weight)}%</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">{formatMoney(row.targetAmount)}</div>
                        <div className="mt-1 text-sm text-gray-500">목표 금액</div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      <div className="rounded-2xl bg-gray-50 p-3">
                        <div className="text-xs text-gray-500">현재 가격</div>
                        <div className="mt-1 text-sm font-semibold text-gray-900">{formatMoney(row.price)}</div>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-3">
                        <div className="text-xs text-gray-500">매수 가능 수량</div>
                        <div className="mt-1 text-sm font-semibold text-gray-900">{formatNumber(row.targetQty)}주</div>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-3">
                        <div className="text-xs text-gray-500">잔액</div>
                        <div className="mt-1 text-sm font-semibold text-gray-900">{formatMoney(row.remainAmount)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {includeCurrentHoldings ? (
              <Card
                title="리밸런싱 제안"
                description="현재 보유 수량 기준으로 목표 비중에 맞추기 위해 어느 자산을 얼마나 매수·매도해야 하는지 계산합니다."
              >
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <div className="text-sm text-gray-500">추가 매수 필요 금액</div>
                    <div className="mt-2 text-xl font-semibold text-gray-900">{formatMoney(summary.buyAmount)}</div>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <div className="text-sm text-gray-500">매도 필요 금액</div>
                    <div className="mt-2 text-xl font-semibold text-gray-900">{formatMoney(summary.sellAmount)}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {rows.map((row) => {
                    const actionText =
                      row.rebalanceAction === "BUY"
                        ? `약 ${formatNumber(row.rebalanceQty)}주 매수`
                        : row.rebalanceAction === "SELL"
                          ? `약 ${formatNumber(row.rebalanceQty)}주 매도`
                          : "유지"

                    const actionColor =
                      row.rebalanceAction === "BUY"
                        ? "text-emerald-600"
                        : row.rebalanceAction === "SELL"
                          ? "text-rose-600"
                          : "text-gray-500"

                    return (
                      <div key={row.id} className="rounded-3xl border border-gray-200 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-base font-semibold text-gray-900">
                              {row.name || "이름 없는 자산"}
                              {row.ticker ? <span className="ml-2 text-sm font-medium text-gray-500">{row.ticker}</span> : null}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              현재 {formatNumber(row.currentQty)}주 · 평가금액 {formatMoney(row.currentValue)}
                            </p>
                          </div>

                          <div className={`text-right text-sm font-semibold ${actionColor}`}>{actionText}</div>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                          <div className="rounded-2xl bg-gray-50 p-3">
                            <div className="text-xs text-gray-500">현재 비중 기준 금액</div>
                            <div className="mt-1 text-sm font-semibold text-gray-900">{formatMoney(row.currentValue)}</div>
                          </div>
                          <div className="rounded-2xl bg-gray-50 p-3">
                            <div className="text-xs text-gray-500">목표 금액</div>
                            <div className="mt-1 text-sm font-semibold text-gray-900">{formatMoney(row.targetValueFromCurrent)}</div>
                          </div>
                          <div className="rounded-2xl bg-gray-50 p-3">
                            <div className="text-xs text-gray-500">차이 금액</div>
                            <div className={`mt-1 text-sm font-semibold ${actionColor}`}>
                              {row.rebalanceAction === "SELL" ? "-" : row.rebalanceAction === "BUY" ? "+" : ""}
                              {formatMoney(Math.abs(row.rebalanceDiff))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      </>
  )
}
