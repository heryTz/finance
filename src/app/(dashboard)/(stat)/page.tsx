"use client";

import { LineChart } from "@/components/chart";
import { useFinanceAnalytics } from "../finance/finance-query";
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

export default function StatPage() {
  const { data, isLoading, isError, error } = useFinanceAnalytics();

  if (isLoading || !data) return <CircularProgress />;
  if (isError && error) return <>{error}</>;

  return (
    <Stack gap={4}>
      <LineChart
        minWidth="900px"
        title="Dépense/Revenu/Bénéfice"
        labels={labels}
        datasets={data.data.datasets}
      />
    </Stack>
  );
}
