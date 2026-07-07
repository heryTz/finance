import { X } from "lucide-react";

import { cn } from "src/shared/lib/utils";

export function FilterChip({
  label,
  prefix,
  onRemove,
  removeLabel,
  className,
}: {
  label: string;
  prefix?: string;
  onRemove: () => void;
  removeLabel?: string;
  className?: string;
}) {
  return (
    <span
      data-slot="filter-chip"
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-full border border-border bg-card pr-1 pl-2.5 text-xs font-medium text-foreground",
        className,
      )}
    >
      <span className="truncate">
        {prefix && <span className="text-muted-foreground">{prefix} </span>}
        {label}
      </span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel ?? `Remove ${label}`}
        className="flex size-4 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="size-3" />
      </button>
    </span>
  );
}
