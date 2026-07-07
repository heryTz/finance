import { cn } from "src/shared/lib/utils";
import { Card, CardContent } from "src/shared/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "src/shared/ui/tooltip";

type StatCardProps = {
  label: string;
  value: string;
  human?: boolean;
  exactValue?: string;
  variant?: "default" | "income" | "expense";
  className?: string;
};

const valueVariants: Record<NonNullable<StatCardProps["variant"]>, string> = {
  default: "text-foreground",
  income: "text-income",
  expense: "text-destructive",
};

export function StatCard({
  label,
  value,
  human,
  exactValue,
  variant = "default",
  className,
}: StatCardProps) {
  const valueClassName = cn(
    "text-2xl font-bold tabular-nums tracking-tight",
    valueVariants[variant],
  );

  return (
    <Card className={className}>
      <CardContent className="pt-3 pb-3 space-y-1">
        <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-widest">
          {label}
        </p>
        {human && exactValue ? (
          <Tooltip>
            <TooltipTrigger
              render={<p className={cn(valueClassName, "cursor-default")} />}
            >
              {value}
            </TooltipTrigger>
            <TooltipContent>{exactValue}</TooltipContent>
          </Tooltip>
        ) : (
          <p className={valueClassName}>{value}</p>
        )}
      </CardContent>
    </Card>
  );
}
