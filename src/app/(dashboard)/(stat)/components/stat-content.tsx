"use client";

import { LineChart } from "@/components/line-chart";
import { GetStats } from "../stat-service";
import { statData } from "../stat-util";
import { Container } from "@/components/container";
import { z } from "zod";
import { getStatsQuerySchema, getStatsQuerySerializer } from "../stat-dto";
import { ChartCard } from "@/components/chart-card";
import { humanAmount, humanFromLastMonth } from "@/lib/humanizer";
import { CountChartCard } from "@/components/count-chart-card";
import { BanknoteIcon } from "lucide-react";
import { MonthPicker } from "@/components/month-picker";
import { useEffect } from "react";
import { createSerializer, useQueryState } from "nuqs";
import { zd } from "@/lib/zod";
import { useRouter } from "next/navigation";
import { StatFilter } from "./stat-filter";

const querySerializer = getStatsQuerySerializer();

const serializer = createSerializer({
  [querySerializer.key]: querySerializer.parser,
});

export function StatContent({ data, defaultFilter }: StatContentProps) {
  const router = useRouter();
  const [filter, setFilter] = useQueryState(
    querySerializer.key,
    querySerializer.parser,
  );

  useEffect(() => {
    setFilter(defaultFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultFilter]);

  const onApply = (data: Partial<zd.infer<typeof getStatsQuerySchema>>) => {
    const newFilter = { ...filter, ...data };
    setFilter(newFilter);
    router.replace(`/${serializer({ filter: newFilter })}`);
  };

  return (
    <Container
      title="Dashboard"
      filter={<StatFilter filter={filter} onApply={onApply} />}
    >
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
        <ChartCard
          title="Aperçu"
          rightComponent={
            <>
              <MonthPicker
                type="range"
                buttonProps={{ className: "w-[210px]" }}
                value={filter.range}
                onChange={(range) => onApply({ range })}
              />
            </>
          }
        >
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
