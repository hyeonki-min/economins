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

export default function LineChart({
  data,
  indicator,
  data2,
  indicator2
}: {
  data: any;
  indicator: any;
  data2: any;
  indicator2: any;
}) {
  const [startYear, setStartYear] = useState(new Date().getFullYear() - 5);
  const [startMonth, setStartMonth] = useState(new Date().getMonth() + 1);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [endMonth, setEndMonth] = useState(new Date().getMonth() + 1);

  const [chartData, setChartData] = useState<ChartData<'line'>>({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>({});

  const monthDiff = (d1: Date, d2: Date) => {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  };

  const getStartEndIdx = (initDateStr: any, type: any) => {
    const initDate = new Date(initDateStr);
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
    if(type.includes('quarterly')) {
      idx = Math.round(idx/3+1);
      rangeIdx = Math.round(rangeIdx/3);
    }
    return [idx, rangeIdx+idx];
  }
  
  useEffect(() => {
    var datasets: any = [];
    const firstIndex = getStartEndIdx(indicator.initDate, indicator.type);
    datasets.push({
      label: indicator.name,
      data:
        firstIndex[1] === 0
          ? data.slice(firstIndex[0])
          : data.slice(firstIndex[0], firstIndex[1]),
      backgroundColor: 'red',
      yAxisID: 'y',
    });
    if (data2.length>1) {
      const secondIndex = getStartEndIdx(indicator2.initDate, indicator2.type);
      datasets.push({
          label: indicator2.name,
          data:
          secondIndex[1] === 0
              ? data2.slice(secondIndex[0])
              : data2.slice(secondIndex[0], secondIndex[1]),
          backgroundColor: 'blue',
          yAxisID: indicator.type===indicator2.type?'y':'y2',
        });
    }
    const getCheckedChartData: ChartData<'line'> = {
      datasets: datasets,
    };
    setChartData(getCheckedChartData);
    setChartOptions(getOption(indicator, indicator2));
  }, [data, data2, indicator, indicator2, startYear, startMonth, endYear, endMonth]);

  const getOption = (indicator:any, indicator2:any) => {
    if (indicator2.length!==0 && (indicator.type !== indicator2.type)) {
      const options: ChartOptions<'line'> = {
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
      return options;
    } else {
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
      return options; 
    }
  }
  
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="flex-auto text-xs text-slate-500">
          {indicator.unit}
        </div>
        <div className="flex flex-auto gap-1 items-center justify-center">
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
        <div className="flex-auto justify-end text-right text-xs text-slate-500">
        {indicator.type===indicator2.type?'':indicator2.unit}
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <div
          className="chart-container"
          style={{ height: '80vh', width: '80vw' }}
        >
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </>
  );
}
