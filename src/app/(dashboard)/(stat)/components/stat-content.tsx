"use client";

import { LineChart } from "@/components/line-chart";
import { GetStats } from "../stat-service";
import { statData } from "../stat-util";
import { Container } from "@/components/container";
import { StatFilter } from "./stat-filter";
import { z } from "zod";
import { getStatsQuerySchema } from "../stat-dto";
import { ChartCard } from "@/components/chart-card";
import { humanAmount } from "@/lib/humanizer";
import { CountChartCard } from "@/components/count-chart-card";
import { BanknoteIcon } from "lucide-react";

export function StatContent({ data, defaultFilter }: StatContentProps) {
  return (
    <Container
      title="Dashboard"
      filter={<StatFilter defaultFilter={defaultFilter} />}
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-3 gap-4">
          <CountChartCard
            title="Bénéfice cumulé"
            statusText="+20.1% from last month"
            Icon={BanknoteIcon}
            value={humanAmount(1000)}
          />
          <CountChartCard
            title="Revenu du dernier mois"
            statusText="+20.1% from last month"
            Icon={BanknoteIcon}
            value={humanAmount(1000)}
          />
          <CountChartCard
            title="Dépense du dernier mois"
            statusText="+20.1% from last month"
            Icon={BanknoteIcon}
            value={humanAmount(1000)}
          />
        </div>
        <ChartCard title="Aperçu">
          <LineChart
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
        </ChartCard>
      </div>
    </Container>
  );
}

type StatContentProps = {
  data: GetStats;
  defaultFilter: z.infer<typeof getStatsQuerySchema>;
};
