"use client";

import { LineChart } from "@/components/line-chart";
import { GetStats } from "../stat-service";
import { statData } from "../stat-util";
import { Container } from "@/components/container";
import { StatFilter } from "./stat-filter";
import { z } from "zod";
import { getStatsQuerySchema } from "../stat-dto";

export function StatContent({ data, defaultFilter }: StatContentProps) {
  return (
    <Container
      title="Dashboard"
      filter={<StatFilter defaultFilter={defaultFilter} />}
    >
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
    </Container>
  );
}

type StatContentProps = {
  data: GetStats;
  defaultFilter: z.infer<typeof getStatsQuerySchema>;
};
