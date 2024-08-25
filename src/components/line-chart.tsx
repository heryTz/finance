"use client";

import {
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

// TODO: improve data type from backend to avoid this adapter
export function LineChart({ title, labels, datasets }: LineChartProps) {
  const chartData: any[] = [];
  for (let i = 0; i < labels.length; i++) {
    const data: any = { month: labels[i] };
    for (let j = 0; j < datasets.length; j++) {
      data[datasets[j].label.toLowerCase()] = datasets[j].data[i];
    }
    chartData.push(data);
  }

  const chartConfig = {} as ChartConfig;
  datasets.forEach((data, i) => {
    chartConfig[data.label] = {
      label: data.label,
      color: `hsl(var(--chart-${(i % 5) + 1}))`,
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
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid strokeDasharray="5 5" />
            <YAxis tickMargin={8} tickCount={10} allowDecimals={false} />
            <XAxis
              dataKey="month"
              tickMargin={8}
              tickFormatter={(value: any) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="revenu par mois"
              type="linear"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="dépense par mois"
              type="linear"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="bénéfice total"
              type="linear"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
            />
            <Legend />
          </RechartLineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

type LineChartProps = {
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
};
