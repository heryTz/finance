"use client";

import { LineChart } from "@/components/line-chart";
import { GetStats } from "../stat-service";
import { statData } from "../stat-util";

export function StatContent({ data }: StatContentProps) {
  return (
    <div className="grid gap-4">
      <LineChart
        title="Dépense/Revenu/Bénéfice"
        data={data.results}
        xAxisConfig={{ dataKey: "month" }}
        lineConfig={[
          {
            dataKey: "income",
            label: statData.income.label,
            color: "hsl(var(--chart-3))",
          },
          {
            dataKey: "expense",
            label: statData.expense.label,
            color: "hsl(var(--chart-2))",
          },
          {
            dataKey: "retainedEarnings",
            label: statData.retainedEarnings.label,
            color: "hsl(var(--chart-1))",
          },
        ]}
      />
    </div>
  );
}

type StatContentProps = {
  data: GetStats;
};
