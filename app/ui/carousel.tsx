'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { events } from '@/app/lib/data/events';
import { CarouselProps } from '@/app/lib/definitions';
import { computeDeltas, hasBaseSeriesAtEvent } from '@/app/lib/compute-delta';
import { formatYm } from '@/app/lib/utils';


export default function Carousel({ event, seriesA, seriesB, indicatorA, indicatorB }: CarouselProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showB, setShowB] = useState(false);
  const isCompareMode = !!indicatorB;
  const pathname = usePathname();
  const target = event?.id;
  const isInitialScrollDone = useRef(false);

  const handleClick = (eventId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentEvent = params.get("event");

    params.delete("start");
    params.delete("end");

    if (currentEvent === eventId) {
      params.delete("event");
    } else {
      params.set("event", eventId);
    }

    router.replace(
      `${pathname}?${params.toString()}`,
      { scroll: false }
    );
  };

  /** ▶ Prev / Next (데스크톱용) */
  const scrollBySlide = (direction: 'prev' | 'next') => {
    const container = containerRef.current;
    if (!container) return;

    const slide = container.firstElementChild as HTMLElement | null;
    if (!slide) return;

    const offset = slide.offsetWidth + 16; // gap-4 = 16px
    container.scrollBy({
      left: direction === 'prev' ? -offset : offset,
      behavior: 'smooth',
    });
  };

  /** ▶ target 변경 시 중앙 정렬 */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !target) return;

    const targetEl = container.querySelector(
      `[data-id="${target}"]`
    ) as HTMLElement | null;

    if (!targetEl) return;

    const containerWidth = container.clientWidth;
    const slideWidth = targetEl.offsetWidth;
    const scrollLeft =
      targetEl.offsetLeft - (containerWidth - slideWidth) / 2;

    container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  }, [target]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isInitialScrollDone.current) return;

    container.scrollLeft = container.scrollWidth;
    isInitialScrollDone.current = true;
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      <div className="w-full overflow-hidden">
        <div
          ref={containerRef}
          className="
            carousel
            flex
            gap-4
            w-full
            overflow-x-auto
            snap-x snap-mandatory
            scroll-smooth
            touch-pan-x
          "
        >
          {events
            .filter(event => hasBaseSeriesAtEvent(seriesA, event?.date))
            .map((event) => {
              const deltasA = computeDeltas(seriesA, event?.date);
              const deltasB = computeDeltas(seriesB, event?.date);

              return (<div
                key={event.id}
                data-id={event.id}
                onClick={() => handleClick(event.id)}
                className={`
                  relative
                  shrink-0
                  snap-center
                  rounded-3xl
                  border
                  cursor-pointer
                  transition-all
                  duration-200

                  /* 📱 Mobile */
                  w-[68%]
                  aspect-[3/4]
                  max-h-[200px]

                  /* 📱 Tablet */
                  sm:w-[72%]
                  sm:aspect-[1/1]
                  sm:max-h-none

                  /* 🖥 Desktop */
                  md:w-[calc(33.33%-(32px/3))]

                  ${
                    event.id === target
                      ? 'border-blue-600 bg-blue-50 shadow-md text-blue-700'
                      : 'border-gray-300 bg-white text-gray-800 hover:border-blue-300'
                  }
                `}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div
                    className="
                      text-xs sm:text-sm
                      text-gray-500
                      tracking-wide
                    "
                  >
                    {formatYm(event.date)}
                  </div>
                  <div
                    className="
                      text-center font-bold
                      break-keep leading-tight px-4
                      text-3xl sm:text-4xl md:text-5xl
                    "
                  >
                    {event.name}
                  </div>
                  <div className={`
                    flex-col
                    items-center
                    gap-1
                    ${showB ? "hidden" : "flex"}
                    md:flex
                  `}>
                    {isCompareMode && (
                      <div
                        className="md:pointer-events-none cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowB(v => !v);
                        }}>
                        <button className="flex items-center gap-1 text-xs text-gray-500">
                          {indicatorA?.name}
                          <span className="md:hidden">⇄</span>
                        </button>
                      </div>
                    )}
                    <div className="grid grid-cols-4 gap-2">
                      {deltasA.map(d => (
                        <div
                          key={d.label}
                          className="
                            flex flex-col items-center
                            rounded-lg px-2 py-1
                            bg-white/70
                            text-xs sm:text-sm
                          "
                        >
                          <span className="text-gray-500">{d.label}</span>
                          <span
                            className={`font-semibold ${
                              d.value == null
                                ? "text-gray-400"
                                : d.value > 0
                                ? "text-red-600"
                                : d.value < 0
                                ? "text-blue-600"
                                : "text-gray-700"
                            }`}
                          >
                            {d.value == null ? "–" : `${d.value > 0 ? "+" : ""}${d.value}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {isCompareMode && (
                  <div className={`
                    flex-col
                    items-center
                    gap-1
                    ${showB ? "flex" : "hidden"}
                    md:flex
                  `}>
                    <div
                      className="md:pointer-events-none cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowB(v => !v);
                        }}>
                      <button className="flex items-center gap-1 text-xs text-gray-500">
                        {indicatorB?.name}
                        <span className="md:hidden">⇄</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {deltasB.map(d => (
                        <div
                        key={d.label}
                        className="
                          flex flex-col items-center
                          rounded-lg px-2 py-1
                          bg-white/70
                          text-xs sm:text-sm
                        "
                      >
                        <span className="text-gray-500">{d.label}</span>
                        <span
                          className={`font-semibold ${
                            d.value == null
                              ? "text-gray-400"
                              : d.value > 0
                              ? "text-red-600"
                              : d.value < 0
                              ? "text-blue-600"
                              : "text-gray-700"
                          }`}
                        >
                          {d.value == null ? "–" : `${d.value > 0 ? "+" : ""}${d.value}`}
                        </span>
                      </div>
                      ))}
                    </div>
                  </div>
                  )}
                </div>
              </div>
              );
            })}
        </div>
      </div>

      {/* ▶ Desktop Buttons */}
      <div className="mt-3 hidden md:flex gap-3">
        <button
          onClick={() => scrollBySlide('prev')}
          className="rounded-full bg-gray-200 p-2 hover:bg-white transition"
          aria-label="Previous"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            width="24"
            height="24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => scrollBySlide('next')}
          className="rounded-full bg-gray-200 p-2 hover:bg-white transition"
          aria-label="Next"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            width="24"
            height="24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
