'use client';

import { useEffect, useRef, useState } from 'react';
import { Timeline } from 'vis-timeline';
import { DataSet } from 'vis-data';
import { events } from '@/app/lib/data/events';
import Link from 'next/link';


export default function VisTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<Timeline | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    
    if (!containerRef.current || timelineRef.current) return;

    const transformed = events.map(e => ({
      id: e.id,
      content: e.name,
      start: e.date,
      url: e.url,
      tooltip: e.description
    }));

    const items = new DataSet(transformed);

    var now = new Date();
    const maxDate = new Date(now.getFullYear(), now.getMonth()+1, 1);
    const isMobile = window.innerWidth < 640;

    const mobileStart = new Date(
      now.getFullYear() - 10,
      now.getMonth(),
      1
    );
    const options = {
      width: '100%',
      height: 300,
      min: new Date(2008, 0, 1),
      max: maxDate,
      editable: false,
      margin: {
        item: 10,
        axis: 5,
      },
      ...(isMobile && {
        start: mobileStart,
        end: maxDate,
      }),
    };

    timelineRef.current = new Timeline(containerRef.current, items, options);

    timelineRef.current.on('select', (props) => {
      if (!props.items || props.items.length === 0) {
        setSelectedItem(null);
        return;
      }
      const selectedId = props.items[0];
      const selectedData = items.get(selectedId);
      setSelectedItem(selectedData);
    });

    return () => {
      timelineRef.current?.destroy();
      timelineRef.current = null;
    };
  }, []);

  return <div>
      <div ref={containerRef} />
      <div className="mt-4">
      {selectedItem && (
        <div
          className="
            rounded-xl
            bg-white
            border border-gray-200
            shadow-sm
            p-5
          "
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span
                className="
                  inline-block
                  rounded-md
                  bg-gray-100
                  px-2 py-0.5
                  text-xs font-medium
                  text-gray-700
                "
              >
                {selectedItem.start}
              </span>
            </div>

            <h4 className="text-sm font-semibold text-gray-900 leading-snug">
              {selectedItem.content}
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              {selectedItem.tooltip}
            </p>
            
            <Link
              href={`${selectedItem.url}?event=${selectedItem.id}`}
              className="
                group mt-1 inline-flex items-center gap-1
                text-sm font-medium text-gray-700
                transition-colors
                hover:text-gray-900
              "
            >
              <span>관련 지표 흐름 보기</span>
              <span
                className="
                  transition-transform
                  group-hover:translate-x-1
                "
                aria-hidden
              >
                →
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
    </div>;
}
