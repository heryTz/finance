import { cn } from "@/lib/utils";
import { ComponentProps, PropsWithChildren } from "react";

export function HScrollable(props: HScrollableProps) {
  return (
    <div
      {...props}
      className={cn(
        "max-w-[calc(100dvw_-_32px)] overflow-auto",
        props.className,
      )}
    />
  );
}

type HScrollableProps = PropsWithChildren & ComponentProps<"div">;
