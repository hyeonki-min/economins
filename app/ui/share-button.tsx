"use client";

import { useCallback } from "react";

export function ShareButton({ extraParams }: { extraParams?: Record<string, string> }) {
  const handleShare = useCallback(() => {
    const url = new URL(window.location.href);

    // 쿼리 파라미터 추가
    if (extraParams) {
      Object.entries(extraParams).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    // 클립보드에 복사
    navigator.clipboard.writeText(url.toString())
      .then(() => alert("링크가 복사되었습니다!"))
      .catch(() => alert("복사에 실패했습니다."));
  }, [extraParams]);

  return (
    <button
      onClick={handleShare}
      aria-label="Share"
      className="
        inline-flex items-center gap-1.5
        rounded-md
        px-2 py-1
        text-sm font-medium
        text-slate-700
        hover:text-blue-700
        hover:bg-blue-50
        active:bg-blue-100
        transition-colors
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-4 w-4 fill-current"
      >
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
      </svg>
      <span>Share</span>
    </button>
  );
}
