import type { ChartOptions } from "chart.js";
import type { Indicator } from "@/app/lib/definitions";
import type {
  AnnotationOptions,
  AnnotationTypeRegistry,
} from "chartjs-plugin-annotation";

type AnnotationMap =
  Record<string, AnnotationOptions<keyof AnnotationTypeRegistry>>;

export function getLineChartOptions(params: {
  indicator: Indicator;
  indicator2?: Indicator;
  beginAtZero: boolean;
  annotations: AnnotationMap;
}): ChartOptions<"line"> {
  const { indicator, indicator2, beginAtZero, annotations } = params;

  const hasY2 = indicator2 && indicator.type !== indicator2.type;

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: hasY2
      ? {
          mode: "nearest",
          intersect: false,
          axis: "x",
        }
      : {
          intersect: false,
          mode: "index",
        },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
          displayFormats: {
            month: "yyyy-MM",
          },
          tooltipFormat: "yyyy-MM",
        },
        grid: {
          display: false,
          drawTicks: false,
        },
      },
      y: {
        type: "linear",
        position: "left",
        beginAtZero,
        grid: hasY2 ? { drawOnChartArea: false } : undefined,
      },
    },
    plugins: {
      annotation: {
        annotations,
      },
    },
  };

  if (hasY2) {
    options.scales!.y2 = {
      type: "linear",
      position: "right",
      beginAtZero,
      grid: {
        drawOnChartArea: false,
      },
    };

    options.plugins!.tooltip = {
      filter: (item) => item.parsed.y !== null,
    };
  }

  return options;
}
