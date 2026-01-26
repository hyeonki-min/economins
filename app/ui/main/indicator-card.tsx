"use client";

import Link from "next/link";
import { useState } from "react";

type Indicator = {
  label: string;
  hint: string;
};

export default function IndicatorCard({
  title,
  description,
  indicators,
  href,
}: {
  title: string;
  description: string;
  indicators: Indicator[];
  href: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="
      rounded-xl border border-gray-200
      bg-white p-4
      shadow-sm
    ">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-gray-900">
          {title}
        </h3>
        <p className="text-sm text-gray-600">
          {description}
        </p>
      </div>

      <div className="flex mt-4 rounded-lg bg-gray-100 p-1 text-sm">
        {indicators.map((item, idx) => (
          <button
            key={item.label}
            onClick={() => setActive(idx)}
            className={`
              flex-1 rounded-md px-2 py-1.5 transition
              ${active === idx
                ? "bg-white shadow text-gray-900 font-medium"
                : "text-gray-500"}
            `}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-3 text-sm text-gray-600">
        · {indicators[active]?.hint}
      </div>
      <Link
        href={href}
        className="
          group mt-4 inline-flex items-center gap-1
          rounded-md px-1 py-0.5
          text-sm font-medium
          text-blue-600
          transition
          hover:bg-blue-50 hover:text-blue-800
        "
      >
        <span>지표 흐름 보기</span>
        <span
          className="
            transition-transform
            group-hover:translate-x-1
          "
        >
          →
        </span>
      </Link>
    </div>
  );
}
