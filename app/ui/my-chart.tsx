'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
  TimeScale,
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import 'chartjs-adapter-date-fns';

// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  TimeScale,
);

ChartJS.register(CategoryScale /* ... */);

export interface Candidate {
  name: string;
  type: string;
  initDate: string;
  start: number;
  end: number;
}

export default function MyChart({
  data,
  indicator,
}: {
  data: any;
  indicator: any;
}) {
  const [startYear, setStartYear] = useState(new Date().getFullYear() - 5);
  const [startMonth, setStartMonth] = useState(new Date().getMonth() + 1);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [endMonth, setEndMonth] = useState(new Date().getMonth() + 1);

  const [chartData, setChartData] = useState<ChartData<'line'>>({
    datasets: [],
  });

  const monthDiff = (d1: Date, d2: Date) => {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  };

  useEffect(() => {
    const initDate = new Date(indicator.initDate);
    let realStartMonth = startMonth - 1;
    let realEndMonth = endMonth;
    let idx = monthDiff(initDate, new Date(startYear, realStartMonth));
    let rangeIdx = monthDiff(
      new Date(startYear, realStartMonth),
      new Date(endYear, realEndMonth),
    );
    if (initDate > new Date(startYear, realStartMonth)) {
      rangeIdx = monthDiff(initDate, new Date(endYear, realEndMonth));
    }
    var startIndex = idx;
    var endIndex = idx + rangeIdx;
    var datasets: any = [];
    datasets.push({
      label: indicator.name,
      data:
        endIndex === 0
          ? data.slice(startIndex)
          : data.slice(startIndex, endIndex),
      backgroundColor: 'red',
      yAxisID: 'y',
    });
    const getCheckedChartData: ChartData<'line'> = {
      datasets: datasets,
    };
    setChartData(getCheckedChartData);
  }, [data, indicator, startYear, startMonth, endYear, endMonth]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
      },
      x: {
        type: 'time',
        time: {
          unit: 'month',
          displayFormats: {
            month: 'yyyy-MM',
          },
          tooltipFormat: 'yyyy-MM',
        },
        grid: {
          display: false,
          drawTicks: false,
        },
      },
    },
  };
  const options2: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y2: {
        type: 'linear',
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
      y: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
      },
      x: {
        type: 'time',
        time: {
          unit: 'month',
          displayFormats: {
            month: 'yyyy-MM',
          },
          tooltipFormat: 'yyyy-MM',
        },
        grid: {
          display: false,
          drawTicks: false,
        },
      },
    },
    plugins: {
      tooltip: {
        filter: (item) => item.parsed.y !== null,
      },
    },
  };
  return (
    <>
      <div className="flex items-center justify-center gap-1">
        <input
          type="number"
          id="startYear"
          aria-describedby="helper-text-explanation"
          className="block rounded-lg p-2.5 text-sm text-gray-900 focus:border-indigo-700 focus:ring-indigo-700"
          min="1900"
          max={new Date().getFullYear()}
          value={startYear}
          onChange={(e) => setStartYear(e.target.valueAsNumber)}
        ></input>
        <input
          type="number"
          id="startMonth"
          aria-describedby="helper-text-explanation"
          className="block rounded-lg p-2.5 text-sm text-gray-900 focus:border-indigo-700 focus:ring-indigo-700"
          min="1"
          max="12"
          value={startMonth}
          onChange={(e) => setStartMonth(e.target.valueAsNumber)}
        ></input>
        <input
          type="number"
          id="endYear"
          aria-describedby="helper-text-explanation"
          className="block rounded-lg p-2.5 text-sm text-gray-900 focus:border-indigo-700 focus:ring-indigo-700"
          min="1900"
          max={new Date().getFullYear()}
          value={endYear}
          onChange={(e) => setEndYear(e.target.valueAsNumber)}
        ></input>
        <input
          type="number"
          id="endMonth"
          aria-describedby="helper-text-explanation"
          className="block rounded-lg p-2.5 text-sm text-gray-900 focus:border-indigo-700 focus:ring-indigo-700"
          min="1"
          max="12"
          value={endMonth}
          onChange={(e) => setEndMonth(e.target.valueAsNumber)}
        ></input>
      </div>
      <div className="flex items-center justify-center">
        <div
          className="chart-container"
          style={{ height: '60vh', width: '80vw' }}
        >
          {<Line data={chartData} options={options} />}
        </div>
      </div>
    </>
  );
}
