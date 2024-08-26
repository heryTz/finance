"use client";

import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartLineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { capitalizeFirstLetter } from "@/lib/humanizer";

export function LineChart<T extends string>({
  title,
  data,
  lineConfig,
  xAxisConfig,
}: LineChartProps<T>) {
  const chartConfig = {} as ChartConfig;
  lineConfig.forEach((el) => {
    chartConfig[el.dataKey] = {
      color: el.color,
      label: el.label,
    };
  });

  return (
    <Card className="overflow-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Janvier - Décembre {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto">
        <ChartContainer
          className="w-full min-w-[700px] max-h-[600px]"
          config={chartConfig}
        >
          <RechartLineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid strokeDasharray="5 5" />
            <YAxis tickMargin={8} tickCount={10} allowDecimals={false} />
            <XAxis
              dataKey={xAxisConfig.dataKey}
              tickMargin={8}
              tickFormatter={(value: string) => capitalizeFirstLetter(value)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {lineConfig.map((el) => (
              <Line
                key={el.dataKey}
                dataKey={el.dataKey}
                type="linear"
                stroke={el.color}
                strokeWidth={2}
                dot={false}
              />
            ))}
            <Legend formatter={(value) => chartConfig[value].label} />
          </RechartLineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

type LineChartProps<T extends string> = {
  title: string;
  data: Array<Record<T, string | number>>;
  lineConfig: Array<{ label: string; dataKey: T; color: string }>;
  xAxisConfig: {
    dataKey: T;
  };
};
