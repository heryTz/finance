"use client";

import { LineChart } from "@/components/line-chart";
import { GetStats } from "../stat-service";
import { statData } from "../stat-util";
import { Container } from "@/components/container";
import { z } from "zod";
import { getStatsQuerySchema } from "../stat-dto";
import { ChartCard } from "@/components/chart-card";
import { humanAmount, humanFromLastMonth } from "@/lib/humanizer";
import { CountChartCard } from "@/components/count-chart-card";
import { BanknoteIcon } from "lucide-react";

export function StatContent({ data }: StatContentProps) {
  return (
    <Container title="Dashboard">
      <div className="grid gap-4">
        <div className="grid grid-cols-3 gap-4">
          <CountChartCard
            title="Balance"
            statusText={humanFromLastMonth(
              data.countStat.currentBalance.fromPreviousMonthInPercent,
            )}
            Icon={BanknoteIcon}
            value={humanAmount(data.countStat.currentBalance.value)}
          />
          <CountChartCard
            title="Revenu du mois"
            statusText={humanFromLastMonth(
              data.countStat.currentIncome.fromPreviousMonthInPercent,
            )}
            Icon={BanknoteIcon}
            value={humanAmount(data.countStat.currentIncome.value)}
          />
          <CountChartCard
            title="Dépense du mois"
            statusText={humanFromLastMonth(
              data.countStat.currentExpense.fromPreviousMonthInPercent,
            )}
            Icon={BanknoteIcon}
            value={humanAmount(data.countStat.currentExpense.value)}
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
                dataKey: "balance",
                label: statData.balance.label,
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
