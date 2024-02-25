"use client";

import { Box, CircularProgress, Paper } from "@mui/material";

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
  loading,
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
      {loading && (
        <Box
          zIndex={10}
          position={"absolute"}
          top={0}
          left={0}
          right={0}
          bottom={0}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CircularProgress />
        </Box>
      )}
    </Paper>
  );
}

type LineChartProps = {
  loading?: boolean;
  minWidth?: string;
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
};
