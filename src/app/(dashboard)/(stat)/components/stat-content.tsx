"use client";

import { LineChart } from "@/components/line-chart";
import { GetStats } from "../stat-service";
import { statData, statDisplayConfig } from "../stat-util";
import { Container } from "@/components/container";
import { z } from "zod";
import { getStatsQuerySchema, getStatsQuerySerializer } from "../stat-dto";
import { ChartCard } from "@/components/chart-card";
import { humanAmount, humanFromLastMonth } from "@/lib/humanizer";
import { CountChartCard } from "@/components/count-chart-card";
import { BanknoteIcon } from "lucide-react";
import { MonthPicker } from "@/components/month-picker";
import { createSerializer, useQueryState } from "nuqs";
import { zd } from "@/lib/zod";
import { useRouter } from "next/navigation";
import { StatDisplay } from "./stat-display";
import dayjs from "dayjs";
import { OperationFilter } from "../../operation/components/opertation-filter";

const querySerializer = getStatsQuerySerializer();

const serializer = createSerializer({
  [querySerializer.key]: querySerializer.parser,
});

export function StatContent({ data }: StatContentProps) {
  const router = useRouter();
  const [filter] = useQueryState(querySerializer.key, querySerializer.parser);

  const onApply = (data: Partial<zd.infer<typeof getStatsQuerySchema>>) => {
    const newFilter = { ...filter, ...data };
    router.replace(`/${serializer({ filter: newFilter })}`);
    router.refresh();
  };

  return (
    <Container
      title="Dashboard"
      filter={<OperationFilter filter={filter} onApply={onApply} />}
      action={<StatDisplay display={filter.display} onApply={onApply} />}
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {[...statDisplayConfig]
            .filter((el) => filter.display.includes(el.name))
            .sort((a, b) => a.order - b.order)
            .map((el) => (
              <CountChartCard
                key={el.name}
                title={el.title}
                statusText={humanFromLastMonth(
                  data.countStat[el.name].fromPreviousMonthInPercent,
                )}
                Icon={el.Icon ?? BanknoteIcon}
                value={humanAmount(data.countStat[el.name].value)}
              />
            ))}
        </div>
        <ChartCard
          title="Aperçu"
          rightComponent={
            <>
              <MonthPicker
                type="range"
                buttonProps={{ className: "w-[210px]" }}
                value={{
                  from: dayjs(filter.range.from).startOf("month").toDate(),
                  to: filter.range.to
                    ? dayjs(filter.range.to).endOf("month").toDate()
                    : null,
                }}
                onChange={(range) =>
                  onApply({
                    range: {
                      from: dayjs(range.from).format("YYYY-MM-DD"),
                      to: range.to
                        ? dayjs(range.to).format("YYYY-MM-DD")
                        : null,
                    },
                  })
                }
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
