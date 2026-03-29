"use client"

import { VEHICLES } from "@/app/lib/calculator/vehicle-presets"
import { VehicleType } from "@/app/lib/definitions"
import { krw } from "@/app/lib/utils"
import { Card, MoneyInput, NumberInput, ResultRow, Row } from "@/app/ui/calculator/component"
import { useEffect, useMemo, useState } from "react"


export default function FuelCalculator() {
  const BUDGET_PRESETS = [30000, 50000, 70000, 100000];
  const [price, setPrice] = useState<number>(1800)
  const [altPrice, setAltPrice] = useState<number>(1770)

  const [budget, setBudget] = useState<number>(50000)
  const [vehicle, setVehicle] = useState<VehicleType>("compact")
  const [distance, setDistance] = useState<number>(5)
  const [fullTank, setFullTank] = useState<boolean>(false)

  // ✅ override 상태
  const [customEfficiency, setCustomEfficiency] = useState<number | null>(null)
  const [customTank, setCustomTank] = useState<number | null>(null)

  const base = VEHICLES[vehicle]

  const efficiency = customEfficiency ?? base.efficiency
  const tank = customTank ?? base.tank

  const maxBudget = tank * price

  // 차량 바뀌면 커스텀 초기화
  useEffect(() => {
    setCustomEfficiency(null)
    setCustomTank(null)
  }, [vehicle])

  useEffect(() => {
    if (fullTank) {
      setBudget(maxBudget)
    }
  }, [fullTank, price, tank])

  useEffect(() => {
    if (!fullTank) {
      setBudget(prev => Math.min(prev, maxBudget))
    }
  }, [vehicle, price, tank])

  const liters = useMemo(() => {
    if (price === 0) return 0
    return budget / price
  }, [budget, price])

  const drivingRange = useMemo(() => {
    return liters * efficiency
  }, [liters, efficiency])

  const priceDiff = useMemo(() => {
    return price - altPrice
  }, [price, altPrice])

  const saving = useMemo(() => {
    return liters * priceDiff
  }, [liters, priceDiff])

  const travelCost = useMemo(() => {
    return ((distance * 2) / efficiency) * price
  }, [distance, efficiency, price])

  const netSaving = saving - travelCost

  function getTravelMessage(netSaving: number) {
    if (netSaving < 0) {
      return { text: "이동 비용이 더 큽니다", color: "text-red-500" }
    }
    if (netSaving < 1000) {
      return { text: "차이가 크지 않습니다", color: "text-gray-500" }
    }
    if (netSaving < 3000) {
      return { text: "조금 더 저렴합니다", color: "text-green-600" }
    }
    return { text: "이동해도 괜찮습니다", color: "text-blue-600" }
  }

  const message = getTravelMessage(netSaving)

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12">

      {/* LEFT RESULT */}
      <aside className="space-y-6 lg:col-span-5 lg:sticky lg:top-6">

        <Card title="이 금액이면 얼마나 주유할 수 있을까요?">

          <div className="text-3xl font-bold">
            {budget.toLocaleString()}원
          </div>

          <div className="text-xl mt-2">
            {liters.toFixed(1)} L
          </div>

          <div className="text-sm text-gray-500 mt-3">
            약 {Math.round(drivingRange)}km 주행 가능
          </div>

        </Card>

        <Card title="더 싼 주유소로 가면 이득일까요?">

          <ResultRow label="가격 차이" value={krw(priceDiff)} />
          <ResultRow label="예상 절약 금액" value={krw(saving)} />
          <ResultRow label="이동 비용" value={krw(travelCost)} />

          <div className="border-t mt-4 pt-4">
            <div className="text-sm text-gray-500">순 절약 금액</div>

            <div className="text-3xl font-bold tabular-nums">
              {krw(netSaving)}
            </div>

            <div className={`text-sm mt-1 ${message.color}`}>
              {message.text}
            </div>
          </div>

        </Card>
      </aside>

      {/* RIGHT INPUT */}
      <section className="lg:col-span-7 space-y-6">

        {/* 가격 */}
        <Card title="주유 가격">
          <Row label="리터당 가격">
            <MoneyInput value={price} onChange={setPrice} />
          </Row>
        </Card>

        {/* 금액 */}
        <Card title="주유 금액">

          <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
            {BUDGET_PRESETS.map((v) => (
              <button
                key={v}
                onClick={() => {
                  setFullTank(false)
                  setBudget(v)
                }}
                className={`px-3 py-2 border rounded-lg text-sm
                ${budget === v && !fullTank ? "border-black bg-gray-100" : "border-gray-200"}`}
              >
                {v / 10000}만원
              </button>
            ))}

            <button
              onClick={() => setFullTank(true)}
              className={`px-3 py-2 border rounded-lg text-sm
              ${fullTank ? "border-black bg-gray-100" : "border-gray-200"}`}
            >
              가득
            </button>
          </div>

          <Row label="직접 입력">
            <MoneyInput
              value={budget}
              onChange={(v) => {
                setFullTank(false)
                setBudget(Math.min(v, maxBudget))
              }}
            />
          </Row>

        </Card>

        {/* ✅ 차량 선택 (애플 스타일) */}
        <Card title="차량 선택">

          <div className="space-y-3">

            {Object.entries(VEHICLES).map(([key, v]) => {

              const active = vehicle === key

              return (
                <div
                  key={key}
                  onClick={() => setVehicle(key as VehicleType)}
                  className={`
                    transition-all duration-300 cursor-pointer
                    rounded-2xl border
                    ${active
                      ? "border-black bg-white shadow-md p-5 scale-[1.02]"
                      : "border-gray-200 bg-gray-50 p-4 opacity-70"}
                  `}
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{v.icon}</span>

                      <div>
                        <div className="text-sm font-semibold">
                          {v.label}
                        </div>

                        {!active && (
                          <div className="text-xs text-gray-400">
                            선택하려면 클릭
                          </div>
                        )}
                      </div>
                    </div>

                    {active && (
                      <div className="w-2 h-2 rounded-full bg-black" />
                    )}
                  </div>

                  {/* ✅ 선택된 경우만 커스텀 */}
                  {active && (
                    <div className="mt-4 pt-4 border-t space-y-3">

                      <Row label="연비 (km/L)">
                        <NumberInput
                          value={efficiency}
                          onChange={setCustomEfficiency}
                        />
                      </Row>

                      <Row label="탱크 (L)">
                        <NumberInput
                          value={tank}
                          onChange={setCustomTank}
                        />
                      </Row>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setCustomEfficiency(null)
                          setCustomTank(null)
                        }}
                        className="text-xs text-blue-500"
                      >
                        기본값으로 되돌리기
                      </button>

                    </div>
                  )}

                </div>
              )
            })}

          </div>

        </Card>

        {/* 대체 주유소 */}
        <Card title="대체 주유소">

          <Row label="거리 (km)">
            <NumberInput value={distance} onChange={setDistance} />
          </Row>

          <Row label="가격">
            <MoneyInput value={altPrice} onChange={setAltPrice} />
          </Row>
          <div className="flex gap-2">

            {[50,100,150,200].map(diff => {

              const active = price - altPrice === diff

              return (
                  <button
                  key={diff}
                  onClick={() => setAltPrice(price - diff)}
                  className={`px-3 py-2 border rounded text-sm
                  ${active ? "border-black bg-gray-100" : "border-gray-200"}`}
                  >
                  -{diff}원
                  </button>
              )
            })}
          </div>
        </Card>

      </section>
    </div>
  )
}