"use client";

import { useMemo, useState } from "react";
import { formatMoney } from "@/app/lib/utils";
import { Card, MoneyInput, ResultRowWithBar } from "@/app/ui/calculator/component";

export function ValueSimulator() {
  const [amount, setAmount] = useState(100_000_000);

  const inflationFactor = 1.28;

  const results = useMemo(() => {
    return [
      { name: "🥇금", value: amount * (237040 / 47573) },
      { name: "🥈아파트 (광장현대)", value: amount * (17 / 4.4) },
      { name: "🥉코스피", value: amount * (5925 / 1994) },
      { name: "🍔빅맥세트", value: amount * (7600 / 4700) },
      { name: "🏦예금", value: amount * 1.28 },
      { name: "💵현금", value: amount },
      { name: "💸실질 현금", value: amount / inflationFactor },

    ].sort((a, b) => b.value - a.value);
  }, [amount]);

  const max = Math.max(...results.map((r) => r.value));
  const best = results[0];
  const worst = results[results.length - 2];

  return (
    <section className="space-y-10">
      <Card title="">
        <div className="text-2xl font-bold leading-snug">
          현금을 그대로 두면, 10년 뒤에는 
          <span className="text-red-500">{formatMoney(amount)}</span>
          의 가치가 지금보다 낮아집니다.
        </div>
        
      <MoneyInput 
        value={amount}
        onChange={setAmount}
      />
      </Card>

      <Card title="2016년 → 2026년 ">
        {results.map((r) => (
          <ResultRowWithBar
            key={r.name}
            name={r.name}
            value={r.value}
            base={amount}
            max={max}
            highlight={r.name === "실질 현금"}
          />
        ))}
      </Card>
      <Card title="결과">
        <div>
          🍔 빅맥은 60% 올랐지만{" "}
          <span className="font-semibold">
            예금은 그만큼 따라가지 못했습니다
          </span>
        </div>

        <div>
          👉 가장 높은 성과는{" "}
          <span className="font-semibold text-gray-900">
            {best.name}
          </span>
        </div>

        <div>
          👉 가장 낮은 선택은{" "}
          <span className="font-semibold text-gray-900">
            {worst.name}
          </span>
        </div>

        <div>
          💸 결과 차이{" "}
          <span className="font-semibold text-gray-900">
            {formatMoney(best.value - worst.value)}
          </span>
        </div>
      </Card>
    </section>
  );
}