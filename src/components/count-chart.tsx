export function CountChart({ value, statusText }: CountChartProps) {
  return (
    <>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{statusText}</div>
    </>
  );
}

type CountChartProps = {
  value: string;
  statusText?: string;
};
