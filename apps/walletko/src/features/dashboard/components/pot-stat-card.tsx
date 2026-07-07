import { useFormatCurrency } from "src/shared/hooks/use-format-currency";
import { Card, CardContent } from "src/shared/ui/card";
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "src/shared/ui/progress";

type PotStatCardProps = {
  name: string;
  balance: number;
  color: string;
  percentage: number;
};

export function PotStatCard({
  name,
  balance,
  color,
  percentage,
}: PotStatCardProps) {
  const { formatFromCent } = useFormatCurrency();

  return (
    <Card>
      <CardContent className="pt-3 pb-3 space-y-2">
        <div className="flex items-center gap-2">
          <span
            className="size-2.5 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <p className="text-[14px] font-semibold truncate flex-1">{name}</p>
          <span className="text-[13px] text-muted-foreground tabular-nums shrink-0">
            {percentage}%
          </span>
        </div>
        <p className="text-lg font-bold tabular-nums">
          {formatFromCent(balance)}
        </p>
        <Progress value={percentage}>
          <ProgressTrack>
            <ProgressIndicator style={{ backgroundColor: color }} />
          </ProgressTrack>
        </Progress>
      </CardContent>
    </Card>
  );
}
