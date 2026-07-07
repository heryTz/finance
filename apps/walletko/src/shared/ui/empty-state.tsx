import { cn } from "src/shared/lib/utils";

export function EmptyState({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl border border-border bg-card px-6 py-16 text-center text-sm text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
