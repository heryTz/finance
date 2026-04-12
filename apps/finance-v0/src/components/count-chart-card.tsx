import { ComponentProps } from "react";
import { ChartCard } from "./chart-card";
import { CountChart } from "./count-chart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function CountChartCard({ Icon, title, ...props }: CountChartCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm tracking-tight font-medium">
            {title}
          </CardTitle>
          {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CountChart {...props} />
      </CardContent>
    </Card>
  );
}

type CountChartCardProps = ComponentProps<typeof ChartCard> &
  ComponentProps<typeof CountChart>;
