// components/MyLineChart.tsx
"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

ChartJS.register(CategoryScale, /* ... */)

export default async function MyLineChart() { 
  return (
    <div className="chart-container" style={{position: 'relative', height:'40vh', width:'80vw'}}>
      <Line
        data={{
          labels: [
            "2023-01",
            "2023-02",
            "2023-03",
            "2023-04",
            "2023-05",
            "2023-06",
            "2023-07",
          ],
          datasets: [
            {
              data: [100, 120, 115, 134, 168, 132, 200],
              backgroundColor: "purple",
            },
            {
              data: [50, 60, 215, 134, 158, 112, 100],
              backgroundColor: "red",
            }
          ],
        }}
        options={{responsive: true, maintainAspectRatio : false}}
      />
    </div>
  );
}