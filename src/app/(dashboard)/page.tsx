"use client";

import { LineChart } from "@/components/chart";
import { useFinanceAnalytics } from "./finance/finance-query";
import { CircularProgress, Stack } from "@mui/material";

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

export default function Dashboard() {
  const { data, isLoading, isError, error } = useFinanceAnalytics();

  if (isLoading || !data) return <CircularProgress />;
  if (isError && error) return <>{error}</>;

  return (
    <Stack gap={4}>
      <LineChart
        minWidth="900px"
        title="Dépense-Revenu par mois et évolution du bénéfice"
        labels={labels}
        datasets={data.data.datasets}
      />
    </Stack>
  );
}
