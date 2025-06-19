'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { events } from '@/app/lib/events';


export default function Carousel({
  target
}: {
  target: any;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleClick = (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentEvent = params.get('event');

      if (currentEvent === id) {
        params.delete('event');
      } else {
        params.set('event', id);
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    };

    useEffect(() => {
      
      if (typeof window === 'undefined') return;

      const container = document.querySelector('.carousel') as HTMLElement | null;
      const slides = document.querySelectorAll('.carousel > div') as NodeListOf<HTMLElement>;
      const dots = document.querySelectorAll('.pagination > span') as NodeListOf<HTMLElement>;
      const prevBtn = document.querySelector('.prev-btn') as HTMLElement | null;
      const nextBtn = document.querySelector('.next-btn') as HTMLElement | null;

      if (!container || !prevBtn || !nextBtn) return;

      const breakpoint = 768;
      const slidesPerPage = 3;

      let touchStartX = 0;
      let touchEndX = 0;

      const getCenterSlideIndex = (): number => {
        const slideWidth = slides[0]?.offsetWidth || 0;
        const containerWidth = container.offsetWidth;
        return Math.round((container.scrollLeft + Math.floor(containerWidth / 2)) / slideWidth);
      };

      const updateActiveDot = (centerSlideIndex: number) => {
        const isMobileView = container.offsetWidth <= breakpoint;
        const dotsCount = isMobileView ? dots.length : dots.length - 2;
        const slidesCount = isMobileView ? 1 : dotsCount - slidesPerPage;
        const pageIndex = centerSlideIndex - slidesCount;

        if (pageIndex >= 0 && pageIndex < dotsCount) {
          dots.forEach((dot) => dot.classList.remove('w-8'));
          dots[pageIndex].classList.add('w-8');
        }
      };

      const handlePrev = () => {
        container.scrollBy({ left: -slides[0].offsetWidth, behavior: 'smooth' });
        const centerSlideIndex = getCenterSlideIndex() - 1;
        updateActiveDot(centerSlideIndex);
      };

      const handleNext = () => {
        container.scrollBy({ left: slides[0].offsetWidth, behavior: 'smooth' });
        const centerSlideIndex = getCenterSlideIndex() + 1;
        updateActiveDot(centerSlideIndex);
      };

      const handleTouchStart = (e: TouchEvent) => {
        touchStartX = e.touches[0].clientX;
      };

      const handleTouchMove = (e: TouchEvent) => {
        touchEndX = e.touches[0].clientX;
      };

      const handleTouchEnd = () => {
        const swipeThreshold = 50;
        let centerSlideIndex = getCenterSlideIndex();

        if (touchStartX - touchEndX > swipeThreshold) {
          centerSlideIndex += 1;
        } else if (touchEndX - touchStartX > swipeThreshold) {
          centerSlideIndex -= 1;
        }

        updateActiveDot(centerSlideIndex);
        touchStartX = 0;
        touchEndX = 0;
      };

      // 이벤트 등록
      prevBtn.addEventListener('click', handlePrev);
      nextBtn.addEventListener('click', handleNext);
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchmove', handleTouchMove);
      container.addEventListener('touchend', handleTouchEnd);

      // 클린업
      return () => {
        prevBtn.removeEventListener('click', handlePrev);
        nextBtn.removeEventListener('click', handleNext);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const container = document.querySelector('.carousel') as HTMLElement | null;

    if (!container || !target) return;

    const targetElement = container.querySelector(`[data-id="${target}"]`) as HTMLElement | null;
    if (targetElement) {
      const slideWidth = targetElement.offsetWidth;
      const slideOffsetLeft = targetElement.offsetLeft;
      const containerWidth = container.clientWidth;

      const scrollLeft = slideOffsetLeft - (containerWidth - slideWidth) / 2;

      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [target]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="carousel scrollbar-hide flex w-full snap-x snap-mandatory gap-4 overflow-x-hidden scroll-smooth">
        {events.map((event) => (
          <div key={event.id} data-id={event.id} data-date={event.date} 
            className={`relative aspect-[1/1] w-[85%] shrink-0 snap-start snap-always rounded-3xl transition-all duration-200
               md:w-[calc(33.33%-(32px/3))] cursor-pointer 
                ${event.id===target ? 'border-blue-600 bg-blue-50 shadow-md text-blue-700' : 'border-gray-300 bg-white text-gray-800 hover:border-blue-300'}
               `}
            onClick={() => handleClick(event.id)}
            >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold">{event.name}</div>
            </div>
          </div>
        ))};
      </div>
      <div className="mt-2">
        <button className="prev-btn rounded-full bg-gray-200 p-2 hover:bg-white transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="next-btn rounded-full bg-gray-200 p-2 hover:bg-white transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}