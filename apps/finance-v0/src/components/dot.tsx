import { cn } from "@/lib/utils";

export function Dot({ className }: DotProps) {
  return (
    <span className={cn("h-3 w-3 rounded-full inline-block", className)}></span>
  );
}

type DotProps = {
  className?: string;
};
