"use client";

import { LineChart } from "@/components/chart";
import { GetStats } from "../stat-service";
import { Stack } from "@mui/material";

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

export function StatContent({ data }: StatContentProps) {
  return (
    <Stack gap={4}>
      <LineChart
        minWidth="900px"
        title="Dépense/Revenu/Bénéfice"
        labels={labels}
        datasets={data.datasets}
      />
    </Stack>
  );
}

type StatContentProps = {
  data: GetStats;
};
