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
import annotationPlugin from 'chartjs-plugin-annotation';
import 'chartjs-adapter-date-fns';
import { presidentTerms } from '@/app/lib/presidents';



// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  TimeScale,
  annotationPlugin,
);

export default function LineChart({
  data,
  indicator,
  data2,
  indicator2,
  eventTime,
  eventTitle,
}: {
  data: any;
  indicator: any;
  data2: any;
  indicator2: any;
  eventTime: any;
  eventTitle: any;
}) {
  const [startYear, setStartYear] = useState(new Date().getFullYear() - 5);
  const [startMonth, setStartMonth] = useState(new Date().getMonth() + 1);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [endMonth, setEndMonth] = useState(new Date().getMonth() + 1);
  const [beginAtZero, setBeginAtZero] = useState<boolean>(false);
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>({});
  const [showAnnotation, setShowAnnotation] = useState<boolean>(false);  
  const [showPresidentTerms, setShowPresidentTerms] = useState<boolean>(false);
  const [annotations, setAnnotations] = useState<Record<string, any>>();


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
    rangeIdx = rangeIdx+idx;
    if (initDate > new Date(startYear, realStartMonth)) {
      rangeIdx = monthDiff(initDate, new Date(endYear, realEndMonth));
    }
    if(type.includes('quarterly')) {
      idx = Math.round(idx/3+1);
      rangeIdx = Math.round(rangeIdx/3);
    }
    return [idx, rangeIdx];
  }

  const formatDate = (year: number, month: number): string => {
    return `${year}-${String(month).padStart(2, '0')}`;
  };

  const getPresidentAnnotations = (
    startYear: number,
    startMonth: number,
    endYear: number,
    endMonth: number,
    isShow: boolean
  ): Record<string, any> => {
    const start = formatDate(startYear, startMonth);
    const end = formatDate(endYear, endMonth);
    if (!isShow) {
      return {};
    }
    return presidentTerms
      .filter(term => term.end >= start && term.start <= end)
      .reduce((acc, term, index) => {
        const xMin = term.start <= start && term.end >= start ? start : term.start;
        const xMax = term.start <= end && term.end >= end ? end : term.end;
        acc[`president${index}`] = {
          type: 'box',
          xMin: xMin,
          xMax: xMax,
          backgroundColor: term.color,
          borderWidth: 0,
          label: {
            display: true,
            content: [term.name],
            position: 'end',
            color: term.labelColor,
            font: { size: 14 },
          }
        };
        return acc;
      }, {} as Record<string, any>);
  };

  const getLineAnnotations = (
    eventTime: any,
    eventTitle: any,
  ): Record<string, any> => {
    return eventTime ? {
      verticalLine: {
        type: 'line',
        scaleID: 'x',
        value: eventTime,
        borderWidth: 2,
        borderColor: 'rgba(255, 99, 132, 0.25)',
        label: {
          display: true,
          content: eventTitle,
        },
      }
    } : {}
  };

  const composeAnnotations = () => {
     if(showPresidentTerms) {
      const presidentAnnotations = getPresidentAnnotations(startYear, startMonth, endYear, endMonth, showPresidentTerms);
      const lineAnnotations = getLineAnnotations(eventTime, eventTitle);
      return {...presidentAnnotations, ...lineAnnotations}
    }else {
      return getLineAnnotations(eventTime, eventTitle);
    }
  };

  useEffect(() => {
    if (
      eventTime != null
    ) {
      setShowAnnotation(true);
      const lineAnnotations = getLineAnnotations(eventTime, eventTitle);
      setAnnotations(lineAnnotations);
      const [inputYearStr, inputMonthStr] = eventTime.split("-");
      const inputYear = parseInt(inputYearStr, 10);
      const inputMonth = parseInt(inputMonthStr, 10);

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      const startY = inputYear - 2;
      const startM = inputMonth;

      let potentialEndY = inputYear + 2;
      let potentialEndM = inputMonth;

      let finalEndY = potentialEndY;
      let finalEndM = potentialEndM;

      if (
        potentialEndY > currentYear ||
        (potentialEndY === currentYear && potentialEndM > currentMonth)
      ) {
        finalEndY = currentYear;
        finalEndM = currentMonth;
      }
      setStartYear(startY);
      setStartMonth(startM);
      setEndYear(finalEndY);
      setEndMonth(finalEndM);
    } else {
      setShowAnnotation(false);
    }
  }, [eventTime, eventTitle])

  useEffect(() => {
    if (eventTime) {
      const [inputYearStr, inputMonthStr] = eventTime.split("-");
      const inputYear = parseInt(inputYearStr, 10);
      const inputMonth = parseInt(inputMonthStr, 10);
      if (
        inputYear > startYear ||
        (inputYear === startYear && inputMonth >= startMonth)
      ) {
        setShowAnnotation(true);
      } else {
        setShowAnnotation(false);
      }
    }
    if(showPresidentTerms) {
      const presidentAnnotations = getPresidentAnnotations(startYear, startMonth, endYear, endMonth, showPresidentTerms);
      setAnnotations(prev => ({
        ...prev,
        ...presidentAnnotations
      }));
    }else {
      const lineAnnotations = getLineAnnotations(eventTime, eventTitle);
      setAnnotations(lineAnnotations);
    }

    var datasets: any = [];
    const firstIndex = getStartEndIdx(indicator.initDate, indicator.type);
    datasets.push({
      label: indicator.name,
      data:
        firstIndex[1] === 0
          ? data.slice(firstIndex[0])
          : data.slice(firstIndex[0], firstIndex[1]),
      backgroundColor: '#FF2400',
      yAxisID: 'y',
      spanGaps: true
    });
    if (data2.length>1) {
      const secondIndex = getStartEndIdx(indicator2.initDate, indicator2.type);
      if (secondIndex[0] !== 0 || secondIndex[1] !== 0) {
        datasets.push({
          label: indicator2.name,
          data:
          secondIndex[1] === 0
              ? data2.slice(secondIndex[0])
              : data2.slice(secondIndex[0], secondIndex[1]),
          backgroundColor: '#008080',
          yAxisID: indicator.type===indicator2.type?'y':'y2',
          spanGaps: true
        });
      }
    }
    const getCheckedChartData: ChartData<'line'> = {
      datasets: datasets,
    };
    setChartData(getCheckedChartData);
    setChartOptions(getOption(indicator, indicator2));

  }, [data, data2, indicator, indicator2, startYear, startMonth, endYear, endMonth, beginAtZero, showPresidentTerms]);

  const getOption = (indicator:any, indicator2:any) => {
    if (indicator2.length!==0 && (indicator.type !== indicator2.type)) {
      const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: 'nearest',
          intersect: false,
          axis: 'x'
        },
        scales: {
          y2: {
            type: 'linear',
            position: 'right',
            beginAtZero: beginAtZero,
            grid: {
              drawOnChartArea: false,
            },
          },
          y: {
            type: 'linear',
            position: 'left',
            beginAtZero: beginAtZero,
            grid: {
              drawOnChartArea: false,
            },
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
          annotation: {
            annotations: composeAnnotations()
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
            beginAtZero: beginAtZero,
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
          annotation: {
            annotations: composeAnnotations()
          },
        }
      };
      return options; 
    }
  }
  
  return (
    <>
      <div className="flex items-center justify-end">
        <div className="flex flex-col">
          <label htmlFor="beginAtZero" className="text-slate-700">
            <input type="checkbox" id="beginAtZero"
            style={{"color": "#008080"}}
            onChange={() => setBeginAtZero(!beginAtZero)}></input>
            Y축을 0부터 시작
          </label>
          <label htmlFor="showPresidentTerms" className="text-slate-700">
            <input type="checkbox" id="showPresidentTerms"
            style={{"color": "#008080"}}
            onChange={() => setShowPresidentTerms(!showPresidentTerms)}></input>
            역대 대통령 재임기간
          </label>
        </div>
      </div>
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
          min="1990"
          max={new Date().getFullYear()}
          maxLength={4}
          value={startYear}
          onChange={(e) => {
            setStartYear(e.target.valueAsNumber);
          }}
          onBlur={(e) => {
            const value = e.target.valueAsNumber;
            const min = parseInt(e.target.min);
            const max = parseInt(e.target.max);
            if(isNaN(value) || value < min){
              setStartYear(min);
            } else if (value > max) {
              setStartYear(max);
            } else if (value > endYear) {
              setStartYear(endYear);
            }
          }}
        >
        </input>
        <input
          type="number"
          id="startMonth"
          aria-describedby="helper-text-explanation"
          className="block rounded-lg p-2.5 text-sm text-gray-900 focus:border-indigo-700 focus:ring-indigo-700"
          min="1"
          max="12"
          maxLength={2}
          value={startMonth}
          onChange={(e) => {
            setStartMonth(e.target.valueAsNumber);
          }}
          onBlur={(e) => {
            const value = e.target.valueAsNumber;
            const min = parseInt(e.target.min);
            const max = parseInt(e.target.max);
            if(isNaN(value) || value < min){
              setStartMonth(min);
            } else if (value > max) {
              setStartMonth(max);
             }
          }}
        ></input>
        <input
          type="number"
          id="endYear"
          aria-describedby="helper-text-explanation"
          className="block rounded-lg p-2.5 text-sm text-gray-900 focus:border-indigo-700 focus:ring-indigo-700"
          min="1990"
          max={new Date().getFullYear()}
          maxLength={4}
          value={endYear}
          onChange={(e) => {
            setEndYear(e.target.valueAsNumber);
          }}
          onBlur={(e) => {
            const value = e.target.valueAsNumber;
            const min = parseInt(e.target.min);
            const max = parseInt(e.target.max);
            if(isNaN(value) || value < min){
              setEndYear(min);
            } else if (value > max) {
              setEndYear(max);
            } else if (value < startYear) {
              setEndYear(startYear);
            }
          }}
        ></input>
        <input
          type="number"
          id="endMonth"
          aria-describedby="helper-text-explanation"
          className="block rounded-lg p-2.5 text-sm text-gray-900 focus:border-indigo-700 focus:ring-indigo-700"
          min="1"
          max="12"
          maxLength={2}
          value={endMonth}
          onChange={(e) => {
            setEndMonth(e.target.valueAsNumber);
          }}
          onBlur={(e) => {
            const value = e.target.valueAsNumber;
            const min = parseInt(e.target.min);
            const max = parseInt(e.target.max);
            if(isNaN(value) || value < min){
              setEndMonth(min);
            } else if (value > max) {
              setEndMonth(max);
             }
          }}
        ></input>
        </div>
        <div className="flex-auto justify-end text-right text-xs text-slate-500">
          {indicator.type===indicator2.type?'':indicator2.unit}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div
          className="chart-container"
        >
          <Line data={chartData} options={chartOptions} plugins={[annotationPlugin]}/>
        </div>
      </div>
    </>
  );
}
