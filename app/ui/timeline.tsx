'use client';

import { useEffect, useRef, useState } from 'react';
import { DataSet, Timeline } from 'vis-timeline/standalone';
import 'vis-timeline/dist/vis-timeline-graph2d.min.css';
import { events } from '@/app/lib/events';


export default function VisTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<Timeline | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    
    if (!containerRef.current || timelineRef.current) return;

    const transformed = events.map(({ id, name, date }) => ({
      id,
      content: name,
      start: date,
    }));

    const items = new DataSet(transformed);

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
            <p>{selectedItem.start}</p>
            <strong>{selectedItem.content}</strong>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>;
}
