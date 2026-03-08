"use client";

import { useEffect, useMemo, useState } from "react";
import { VEHICLES } from "@/app/lib/calculator/vehicle-presets";
import { Card, NumberInput, Row } from "@/app/ui/calculator/component";
import { krw } from "@/app/lib/utils";
import { VehicleType } from "@/app/lib/definitions";

const BUDGET_PRESETS = [30000, 50000, 70000, 100000];

export default function FuelCalculator() {

  const [price, setPrice] = useState<number>(1680)
  const [altPrice, setAltPrice] = useState<number>(1630)

  const [budget, setBudget] = useState<number>(50000)
  const [vehicle, setVehicle] = useState<VehicleType>("compact")
  const [distance, setDistance] = useState<number>(5)
  const [fullTank, setFullTank] = useState<boolean>(false)

  const tank = VEHICLES[vehicle].tank
  const efficiency = VEHICLES[vehicle].efficiency

  const maxBudget = tank * price

  useEffect(() => {
    if (fullTank) {
      setBudget(maxBudget)
    }
  }, [fullTank, price, tank])

  useEffect(() => {
    if (!fullTank) {
      setBudget(prev => Math.min(prev, maxBudget))
    }
  }, [vehicle, price])

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

  const message = getTravelMessage(netSaving)

  function getTravelMessage(netSaving: number) {

    if (netSaving < 0) {
        return {
        text: "이동 비용이 더 큽니다",
        color: "text-red-500"
        }
    }

    if (netSaving < 1000) {
        return {
        text: "차이가 크지 않습니다",
        color: "text-gray-500"
        }
    }

    if (netSaving < 3000) {
        return {
        text: "조금 더 저렴합니다",
        color: "text-green-600"
        }
    }

    return {
        text: "이동해도 괜찮습니다",
        color: "text-blue-600"
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

      {/* LEFT RESULT */}

      <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-6 h-fit">

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

        <Row label="가격 차이">
            {krw(priceDiff)}
        </Row>

        <Row label="예상 절약 금액">
            {krw(saving)}
        </Row>

        <Row label="이동 비용">
            {krw(travelCost)}
        </Row>

        <div className="border-t mt-4 pt-4">

            <div className="text-sm text-gray-500">
            순 절약 금액
            </div>

            <div className="text-3xl font-bold">
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

        <Card title="주유 가격">

          <Row label="리터당 가격">

            <NumberInput
              value={price}
              step={1}
              onChange={setPrice}
            />

          </Row>

        </Card>

        <Card title="원하시는 주유 금액 선택해주세요">

          <div className="flex flex-wrap gap-2 mb-3">

            {BUDGET_PRESETS.map((v) => (
              <button
                key={v}
                onClick={() => {
                  setFullTank(false);
                  setBudget(v);
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

            <NumberInput
              value={budget}
              step={1000}
              onChange={(v)=>{
                setFullTank(false)
                setBudget(Math.min(v, maxBudget))
              }}
            />

          </Row>

        </Card>


        <Card title="차량 선택">

          <div className="grid grid-cols-5 gap-2">

            {Object.entries(VEHICLES).map(([key,v]) => (

              <div
                key={key}
                onClick={()=> setVehicle(key as VehicleType)}
                className={`p-3 rounded-lg border text-center cursor-pointer
                ${vehicle === key ? "border-black bg-gray-100" : "border-gray-200"}`}
              >

                <div className="text-lg">
                  {v.icon}
                </div>

                <div className="text-sm">
                  {v.label}
                </div>

                <div className="text-xs text-gray-500">
                  {v.tank}L
                </div>

              </div>

            ))}

          </div>

        </Card>


        <Card title="대체 주유소 조건">

          <Row label="거리 (km)">
            <NumberInput
              value={distance}
              step={1}
              onChange={setDistance}
            />
          </Row>

          <Row label="대체 주유소 가격">

            <NumberInput
              value={altPrice}
              step={1}
              onChange={setAltPrice}
            />

          </Row>

          <div className="flex gap-2 mt-2">

            {[10,50,100,150,200].map(diff => {

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