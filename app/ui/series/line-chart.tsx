'use client';


import {
  Chart as ChartJS,
  LinearScale,
  TimeScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import type { ChartData } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import "chartjs-adapter-date-fns";

import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';

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
import { composeAnnotations } from "@/app/ui/series/chart-annotations";
import { getLineDatasets } from "@/app/ui/series/chart-datasets";
import { getLineChartOptions } from "@/app/ui/series/chart-options";
import { deriveRangeFromEvent } from "./chart-event-range";


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

  const [beginAtZero, setBeginAtZero] = useState(false);
  const [showPresidentTerms, setShowPresidentTerms] = useState(false);

  const [openPicker, setOpenPicker] = useState<"start" | "end" | null>(null);

  const shouldShowSecondaryUnit = indicator2 && indicator.type !== indicator2.type;

  useEffect(() => {
    const derived = deriveRangeFromEvent(event, new Date());

    if (!derived) {
      return;
    }

    setStartYear(derived.startYear);
    setStartMonth(derived.startMonth);
    setEndYear(derived.endYear);
    setEndMonth(derived.endMonth);
  }, [event]);

  const annotations = useMemo(() => {
    return composeAnnotations({
      showPresidentTerms,
      startYear,
      startMonth,
      endYear,
      endMonth,
      event: event
    });
  }, [showPresidentTerms, startYear, startMonth, endYear, endMonth, event?.date, event?.name]);

  const chartData = useMemo<ChartData<"line", XYPointList>>(() => ({
    datasets: getLineDatasets({
      data,
      indicator,
      data2,
      indicator2,
      startYear,
      startMonth,
      endYear,
      endMonth,
    }),
  }), [
    data,
    data2,
    indicator,
    indicator2,
    startYear,
    startMonth,
    endYear,
    endMonth,
  ]);

  const chartOptions = useMemo(() => {
    return getLineChartOptions({
      indicator,
      indicator2,
      beginAtZero,
      annotations,
    });
  }, [indicator, indicator2, beginAtZero, annotations]);

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
          <Line data={chartData} options={chartOptions}/>
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
