import { PropsWithChildren, RefObject } from "react";
import Tippy from "@tippyjs/react/headless";
import { cn } from "@/lib/utils";
import { usePopover } from "@/lib/use-popover";

type PopoverV2Props = PropsWithChildren<{
  className?: string;
  triggerComponent?: React.ReactNode;
}> &
  ReturnType<typeof usePopover>;

export function PopoverV2({
  className,
  children,
  anchor,
  open,
  setOpen,
}: PopoverV2Props) {
  return (
    <Tippy
      reference={anchor as RefObject<Element>}
      visible={open}
      interactive
      placement="bottom-start"
      onClickOutside={() => setOpen(false)}
      render={(attrs) => (
        <div
          className={cn(
            "rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className,
          )}
          style={{ width: anchor.current?.clientWidth }}
          {...attrs}
        >
          {children}
        </div>
      )}
    />
  );
}
