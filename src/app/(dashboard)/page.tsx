"use client";

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
import { useFinanceAnalytics } from "./finance/finance-query";
import { CircularProgress } from "@mui/material";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    title: {
      display: true,
      text: "Dépense-Revenu par mois",
    },
  },
};

const labels = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const defaultDatasets = [
  {
    borderColor: "rgb(255, 99, 132)",
    backgroundColor: "rgba(255, 99, 132, 0.5)",
  },
  {
    borderColor: "rgb(53, 162, 235)",
    backgroundColor: "rgba(53, 162, 235, 0.5)",
  },
];

export default function Dashboard() {
  const { data, isLoading, isError, error } = useFinanceAnalytics();

  if (isLoading || !data) return <CircularProgress />;
  if (isError && error) return <>{error}</>;

  return (
    <Line
      options={options}
      data={{
        labels,
        datasets: data.data.datasets.map((el, index) => ({
          ...defaultDatasets[index % defaultDatasets.length],
          ...el,
        })),
      }}
    />
  );
}
