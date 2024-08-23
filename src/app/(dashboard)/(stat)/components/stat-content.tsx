"use client";

import { LineChart } from "@/components/chart/line-chart";
import { GetStats } from "../stat-service";

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
    <div className="grid gap-4">
      <LineChart
        title="Dépense/Revenu/Bénéfice"
        labels={labels}
        datasets={data.datasets}
      />
    </div>
  );
}

type StatContentProps = {
  data: GetStats;
};
