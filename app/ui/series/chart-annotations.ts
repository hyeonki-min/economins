import { AnnotationOptions, AnnotationTypeRegistry } from "chartjs-plugin-annotation";
import {
  formatYearMonth
} from "@/app/lib/utils";
import {
  Events,
} from "@/app/lib/definitions";
import { presidentTerms } from "@/app/lib/presidents";


type AnnotationMap =
  Record<string, AnnotationOptions<keyof AnnotationTypeRegistry>>;


export function composeAnnotations(params: {
  showPresidentTerms: boolean;
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  event?: Events;
}): AnnotationMap {
  const { showPresidentTerms, startYear, startMonth, endYear, endMonth, event } =
    params;

  const line = getLineAnnotations(event);

  if (!showPresidentTerms) return line;

  const presidents = getPresidentAnnotations({
    startYear,
    startMonth,
    endYear,
    endMonth,
    isShow: true,
  });

  return { ...presidents, ...line };
}

function getPresidentAnnotations(params: {
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  isShow: boolean;
}): AnnotationMap {
  const { startYear, startMonth, endYear, endMonth, isShow } = params;

  if (!isShow) return {};

  const start = formatYearMonth(startYear, startMonth);
  const end = formatYearMonth(endYear, endMonth);

  return presidentTerms
    .filter((term) => term.end >= start && term.start <= end)
    .reduce((acc, term, index) => {
      const xMin =
        term.start <= start && term.end >= start ? start : term.start;
      const xMax = term.start <= end && term.end >= end ? end : term.end;

      acc[`president${index}`] = {
        type: "box",
        xMin,
        xMax,
        backgroundColor: term.color,
        borderWidth: 0,
        label: {
          display: true,
          content: [term.name],
          position: "end",
          color: term.labelColor,
          font: { size: 14 },
        },
      };
      return acc;
    }, {} as AnnotationMap);
}

function getLineAnnotations(
  event?: Events
): AnnotationMap {
  const annotations: Record<
    string,
    AnnotationOptions<keyof AnnotationTypeRegistry>
  > = {};

  if (!event?.date) {
    return annotations; // 항상 Record
  }

  annotations.verticalLine = {
    type: "line",
    scaleID: "x",
    value: event.date,
    borderWidth: 2,
    borderColor: "rgba(255, 99, 132, 0.25)",
    label: {
      display: true,
      content: event.name,
    },
  };

  return annotations;
}