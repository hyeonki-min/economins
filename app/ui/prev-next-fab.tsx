"use client";

import Link from "next/link";

export default function PrevNextFab({
  direction,
  targetId,
}: {
  direction: "prev" | "next";
  targetId: string | null;
}) {
  const isPrev = direction === "prev";
  const isDisabled = targetId === null;

  // 공통 스타일
  const baseClasses = `
    rounded-full flex items-center justify-center transition
    bg-white text-gray-700 hover:bg-gray-100 active:scale-95
    disabled:opacity-30 disabled:pointer-events-none
  `;

  return (
    <>
      {/* Desktop Button */}
      {isDisabled ? (
        <button
          className={`
            hidden md:flex fixed top-1/2 -translate-y-1/2 z-[1000]
            w-7 h-7 ${baseClasses}
            ${isPrev ? "left-[0.5rem] md:left-8" : "right-[0.5rem] md:right-8"}
          `}
          disabled
        >
          {isPrev ? "◀" : "▶"}
        </button>
      ) : (
        <Link
          href={`/monetary-policy/${targetId}`}
          className={`
            hidden md:flex fixed top-1/2 -translate-y-1/2 z-[1000]
            w-7 h-7 ${baseClasses}
            ${isPrev ? "left-[0.5rem] md:left-8" : "right-[0.5rem] md:right-8"}
          `}
        >
          {isPrev ? "◀" : "▶"}
        </Link>
      )}

      {/* Mobile Button */}
      {isDisabled ? (
        <button
          className={`
            md:hidden fixed bottom-10
            ${isPrev ? "left-4" : "right-4"}
            px-4 py-2 text-sm font-medium ${baseClasses}
          `}
          disabled
        >
          {isPrev ? "◀" : "▶"}
        </button>
      ) : (
        <Link
          href={`/monetary-policy/${targetId}`}
          className={`
            md:hidden fixed bottom-10
            ${isPrev ? "left-4" : "right-4"}
            px-4 py-2 text-sm font-medium ${baseClasses}
          `}
        >
          {isPrev ? "◀" : "▶"}
        </Link>
      )}
    </>
  );
}
