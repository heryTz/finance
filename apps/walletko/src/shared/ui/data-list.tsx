import type * as React from "react";

import { cn } from "src/shared/lib/utils";

function DataList({
  header,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { header?: React.ReactNode }) {
  return (
    <div
      data-slot="data-list"
      className={cn(
        "overflow-hidden rounded-xl bg-card text-sm text-card-foreground ring-1 ring-foreground/10",
        className,
      )}
      {...props}
    >
      {header && (
        <div
          data-slot="data-list-header"
          className="flex items-center gap-3 border-b border-border px-4 py-2"
        >
          {header}
        </div>
      )}
      <div data-slot="data-list-body" className="divide-y divide-border/60">
        {children}
      </div>
    </div>
  );
}

function DataListHead({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="data-list-head"
      className={cn(
        "text-[11px] font-semibold tracking-widest text-muted-foreground uppercase",
        className,
      )}
      {...props}
    />
  );
}

function DataListRow({
  className,
  interactive,
  ...props
}: React.ComponentProps<"div"> & { interactive?: boolean }) {
  return (
    <div
      data-slot="data-list-row"
      className={cn(
        "group/row flex min-h-9 items-center gap-3 px-4 py-2 transition-colors hover:bg-muted/30",
        interactive && "cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}

export { DataList, DataListHead, DataListRow };
