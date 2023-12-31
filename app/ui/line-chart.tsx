"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import type { ChartData, ChartOptions } from 'chart.js';
import { Line } from "react-chartjs-2";
import { getChartData, Rate } from '@/app/lib/json';
import { useEffect, useState } from "react";

// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

ChartJS.register(CategoryScale, /* ... */)

export default function MyLineChart({ dataType }: { dataType: Array<string> }) {
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>({});
  const backgroundColors = ['red', 'blue', 'orange', 'green', 'yellow', 'purple', 'gray'];
  useEffect(() => {
    var datasets: any = [];

    getChartData().then((data) => {
      dataType.forEach((element, index) => {
        datasets.push({
          'label': element,
          'data': data[element as keyof Rate],
          'backgroundColor': backgroundColors[index]
        });
      });
      const getCheckedChartData: ChartData <'line'> = {
        labels: data.date,
        datasets: datasets
      };
      setChartData(
        getCheckedChartData
      );  
    });

    setChartOptions({
      responsive: true,
      maintainAspectRatio: true,
      scales: {y: {beginAtZero: true}}
    });
  }, [dataType]);

  return (
    <div className="chart-container" style={{height:'50vh', width:'80vw'}}>
      <Line
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}