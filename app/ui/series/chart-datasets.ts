import {
  monthDiff
} from "@/app/lib/utils";
import type { ChartDataset } from "chart.js";
import type { Indicator, XYPointList } from "@/app/lib/definitions";


export function getStartEndIdx(
  initDateStr: string,
  type: string,
  startYear: number,
  startMonth: number,
  endYear: number,
  endMonth: number,
) {
  const initDate = new Date(initDateStr);
  const realStartMonth = startMonth - 1;
  const realEndMonth = endMonth;

  let idx = monthDiff(initDate, new Date(startYear, realStartMonth));
  let rangeIdx = monthDiff(
    new Date(startYear, realStartMonth),
    new Date(endYear, realEndMonth),
  );

  rangeIdx = rangeIdx + idx;

  if (initDate > new Date(startYear, realStartMonth)) {
    rangeIdx = monthDiff(initDate, new Date(endYear, realEndMonth));
  }

  if (type.includes("quarterly")) {
    idx = Math.round(idx / 3 + 1);
    rangeIdx = Math.round(rangeIdx / 3);
  }

  return [idx, rangeIdx] as const;
}

export function getLineDatasets(params: {
  data: XYPointList;
  indicator: Indicator;
  data2?: XYPointList;
  indicator2?: Indicator;
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
}): ChartDataset<"line", XYPointList>[] {
  const {
    data,
    indicator,
    data2,
    indicator2,
    startYear,
    startMonth,
    endYear,
    endMonth,
  } = params;

  const datasets: ChartDataset<"line", XYPointList>[] = [];

  const [idx1, range1] = getStartEndIdx(
    indicator.initDate,
    indicator.type,
    startYear,
    startMonth,
    endYear,
    endMonth,
  );

  datasets.push({
    label: indicator.name,
    data: range1 === 0 ? data.slice(idx1) : data.slice(idx1, range1),
    backgroundColor: "#FF2400",
    yAxisID: "y",
    spanGaps: true,
  });

  if (data2 && indicator2 && data2.length > 1) {
    const [idx2, range2] = getStartEndIdx(
      indicator2.initDate,
      indicator2.type,
      startYear,
      startMonth,
      endYear,
      endMonth,
    );

    if (idx2 !== 0 || range2 !== 0) {
      datasets.push({
        label: indicator2.name,
        data: range2 === 0 ? data2.slice(idx2) : data2.slice(idx2, range2),
        backgroundColor: "#008080",
        yAxisID:
          indicator.type === indicator2.type ? "y" : "y2",
        spanGaps: true,
      });
    }
  }

  return datasets;
}