"use client";

import { LineChart } from "@/components/chart";
import { useFinanceAnalytics } from "./finance/finance-query";
import { CircularProgress, Stack } from "@mui/material";
import { runningSum, sum } from "../helper";

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

  const incomeDataset = data.data.datasets.find((el) => el.label === "Revenu")!;
  const expenseDataset = data.data.datasets.find(
    (el) => el.label === "Dépense"
  )!;
  const incomeEvo: number[] = runningSum(incomeDataset.data);
  const expenseEvo: number[] = runningSum(expenseDataset.data);
  const profitEvo: number[] = incomeEvo.reduce((acc, cur, index) => {
    acc.push(incomeEvo[index] - expenseEvo[index]);
    return acc;
  }, [] as number[]);

  return (
    <Stack gap={4}>
      <LineChart
        minWidth="900px"
        title="Dépense-Revenu par mois"
        labels={labels}
        datasets={data.data.datasets}
      />
      <LineChart
        minWidth="900px"
        title="Bénéfice"
        labels={labels}
        datasets={[
          { label: "Revenu", data: incomeEvo },
          { label: "Dépense", data: expenseEvo },
          { label: "Bénéfice", data: profitEvo },
        ]}
      />
    </Stack>
  );
}
