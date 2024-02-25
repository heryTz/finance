"use client";

import { Paper } from "@mui/material";

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const defaultDatasets = [
  {
    borderColor: "rgb(53, 162, 235)",
    backgroundColor: "rgba(53, 162, 235, 0.5)",
  },
  {
    borderColor: "rgb(255, 99, 132)",
    backgroundColor: "rgba(255, 99, 132, 0.5)",
  },
  {
    borderColor: "rgb(75, 192, 192)",
    backgroundColor: "rgba(75, 192, 192, 0.5)",
  },
];

export function LineChart({
  title,
  datasets,
  labels,
  minWidth,
}: LineChartProps) {
  return (
    <Paper sx={{ p: 2 }} style={{ position: "relative", minWidth }}>
      <Line
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              position: "bottom" as const,
            },
            title: {
              display: true,
              text: title,
            },
          },
        }}
        data={{
          labels,
          datasets: datasets.map((el, index) => ({
            ...defaultDatasets[index % defaultDatasets.length],
            ...el,
          })),
        }}
      />
    </Paper>
  );
}

type LineChartProps = {
  minWidth?: string;
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
};
