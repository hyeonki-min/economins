'use client';

import { useEffect, useRef, useState } from 'react';
import { DataSet, Timeline } from 'vis-timeline/standalone';
import 'vis-timeline/dist/vis-timeline-graph2d.min.css';

export default function VisTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<Timeline | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    
    if (!containerRef.current || timelineRef.current) return;

    const items = new DataSet([
      { id: 1, content: '윤석열 대통령 당선', start: '2022-04' },
      { id: 2, content: '윤석열 대통령 쿠테타', start: '2024-12' },
      { id: 3, content: '윤석열 대통령 탄핵', start: '2025-04' },
    ]);

    var now = new Date();
    const maxDate = new Date(now.getFullYear(), now.getMonth()+1, 1);

    const options = {
      width: '100%',
      height: '300px',
      min: new Date(1970, 0, 1),
      max: maxDate,
      editable: false,
      margin: {
        item: 10,
        axis: 5,
      },
      
    };

    timelineRef.current = new Timeline(containerRef.current, items, options);

    timelineRef.current.on('select', (props) => {
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
     <div className="mt-4 p-4 border rounded bg-gray-100 text-sm">
        {selectedItem ? (
          <div>
            <strong>{selectedItem.content}</strong>
            <p>{selectedItem.description}</p>
            <p>시작일: {selectedItem.start}</p>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>;
}
