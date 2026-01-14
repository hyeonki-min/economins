'use client';


import {
  Chart as ChartJS,
  LinearScale,
  TimeScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import "chartjs-adapter-date-fns";

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { presidentTerms } from "@/app/lib/presidents";
import {
  getMonth,
  getStringYearMonth,
  getYear,
} from "@/app/lib/utils";
import {
  DateRange,
  Events,
  Indicator,
  XYPointList,
} from "@/app/lib/definitions";

import { ShareButton } from "@/app/ui/share-button";
import { YearMonthInputGroup } from "@/app/ui/series/date";
import { PeriodShortcut } from "@/app/ui/series/period-shortcut";
import { ChartSpecialOptions } from "@/app/ui/series/chart-special-options";


// Register ChartJS components using ChartJS.register
ChartJS.register(
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
  dateRange,
  event,
}: {
  data: XYPointList;
  indicator: Indicator;
  data2: XYPointList;
  indicator2?: Indicator;
  dateRange: DateRange;
  event: Events | undefined;
}) {
  
  const [startYear, setStartYear] = useState(getYear(dateRange.start));
  const [startMonth, setStartMonth] = useState(getMonth(dateRange.start));
  const [endYear, setEndYear] = useState(getYear(dateRange.end));
  const [endMonth, setEndMonth] = useState(getMonth(dateRange.end));
  const [beginAtZero, setBeginAtZero] = useState<boolean>(false);
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>({});
  const [showAnnotation, setShowAnnotation] = useState<boolean>(false);  
  const [showPresidentTerms, setShowPresidentTerms] = useState<boolean>(false);
  const [annotations, setAnnotations] = useState<Record<string, any>>();
  const [openPicker, setOpenPicker] = useState<"start" | "end" | null>(null);

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
    eventTime?: string | null,
    eventTitle?: string | null,
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
      const lineAnnotations = getLineAnnotations(event?.date, event?.name);
      return {...presidentAnnotations, ...lineAnnotations}
    }else {
      return getLineAnnotations(event?.date, event?.name);
    }
  };

  const changeStartYearByPeriod = (period : number) => {
    setStartYear(endYear - period);
  }

  function applyStartDate(year: number, month: number) {
    const maxYear = new Date().getFullYear();

    let y = Math.min(Math.max(year, 1990), maxYear);

    // range 보호
    if (y > endYear) {
      y = endYear;
    }

    setStartYear(y);
    setStartMonth(month);
  }

  function applyEndDate(year: number, month: number) {
    const maxYear = new Date().getFullYear();

    let y = Math.min(Math.max(year, 1990), maxYear);

    if (
      year < startYear ||
      (year === startYear && month < startMonth)
    ) {
      year = startYear;
      month = startMonth;
    }

    setEndYear(year);
    setEndMonth(month);
    setOpenPicker(null);
  }

  const shouldShowSecondaryUnit = indicator2 && indicator.type !== indicator2.type;

  useEffect(() => {
    if (
      event != null
    ) {
      setShowAnnotation(true);
      const lineAnnotations = getLineAnnotations(event.date, event.name);
      setAnnotations(lineAnnotations);
      const [inputYearStr, inputMonthStr] = event.date.split("-");
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
  }, [event])

  useEffect(() => {
    if (event?.date) {
      const [inputYearStr, inputMonthStr] = event.date.split("-");
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
      const lineAnnotations = getLineAnnotations(event?.date, event?.name);
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
      const secondIndex = getStartEndIdx(indicator2?.initDate, indicator2?.type);
      if (secondIndex[0] !== 0 || secondIndex[1] !== 0) {
        datasets.push({
          label: indicator2?.name,
          data:
          secondIndex[1] === 0
              ? data2.slice(secondIndex[0])
              : data2.slice(secondIndex[0], secondIndex[1]),
          backgroundColor: '#008080',
          yAxisID: indicator.type===indicator2?.type?'y':'y2',
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

  const getOption = (indicator: Indicator, indicator2?: Indicator) => {
    if (indicator2 !== undefined && (indicator.type !== indicator2?.type)) {
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
          <ChartSpecialOptions
            beginAtZero={beginAtZero}
            showPresidentTerms={showPresidentTerms}
            onToggleBeginAtZero={() => setBeginAtZero((v) => !v)}
            onToggleShowPresidentTerms={() => setShowPresidentTerms((v) => !v)}
          />
      </div>
      <div className="flex items-center justify-center gap-2 mb-2">
        <PeriodShortcut
          periods={[3, 5, 10]}
          onSelect={(years) => changeStartYearByPeriod(years)}
        />
      </div>
      <div className="flex items-center justify-center">
        <div className="flex-auto text-xs text-slate-500">
          {indicator.unit}
        </div>
        <div className="flex flex-auto gap-2 items-center justify-center">
          <YearMonthInputGroup
            target="start"
            openPicker={openPicker}
            setOpenPicker={setOpenPicker}
            year={startYear}
            month={startMonth}
            onSelect={applyStartDate}
            idPrefix="start"
            indicatorA={indicator}
            indicatorB={indicator2}
          />

          <span className="text-slate-400">-</span>

          <YearMonthInputGroup
            target="end"
            openPicker={openPicker}
            setOpenPicker={setOpenPicker}
            year={endYear}
            month={endMonth}
            onSelect={applyEndDate}
            idPrefix="end"
            indicatorA={indicator}
            indicatorB={indicator2}
          />
        </div>
        <div className="flex-auto justify-end text-right text-xs text-slate-500">
          {shouldShowSecondaryUnit ? indicator2.unit : null}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} plugins={[annotationPlugin]}/>
        </div>
      </div>
      <hr/>
      <div className="flex items-center justify-end">
        <div className="flex flex-col">
          <ShareButton extraParams={{ 'start': getStringYearMonth(startYear, startMonth), 'end': getStringYearMonth(endYear, endMonth) }} />
        </div>
      </div>
    </>
  );
}
