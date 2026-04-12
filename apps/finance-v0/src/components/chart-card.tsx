import { PropsWithChildren } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function ChartCard({
  Icon,
  children,
  title,
  rightComponent,
}: ChartCardProps) {
  return (
    <Card className="overflow-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex-1">{title}</CardTitle>
          {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
          {rightComponent}
        </div>
      </CardHeader>
      <CardContent className="overflow-auto">{children}</CardContent>
    </Card>
  );
}

type ChartCardProps = PropsWithChildren<{
  title: string;
  Icon?: React.ComponentType<{ className?: string }>;
  rightComponent?: React.ReactNode;
}>;
