import { Loader, type LucideProps } from "lucide-react";

import { cn } from "src/shared/lib/utils";

export function Spinner({ className, ...props }: LucideProps) {
  return (
    <Loader
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}
