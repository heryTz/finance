import { ComponentProps, PropsWithChildren } from "react";
import { Container } from "./container";
import { Button } from "./ui/button";
import { Empty } from "./empty";
import { cn } from "@/lib/utils";

export function DataTableWrapper({
  cta,
  children,
  action,
  count,
  emptyProps,
  ...containerProps
}: DataTableWrapperProps) {
  return (
    <Container
      action={
        <>
          {count > 0 ? (
            <Button onClick={cta.onClick}>{cta.label}</Button>
          ) : null}
          {action}
        </>
      }
      {...containerProps}
    >
      {count === 0 ? (
        <Empty
          withBorder
          {...emptyProps}
          className={cn("flex-1", emptyProps.className)}
          cta={cta}
        />
      ) : (
        children
      )}
    </Container>
  );
}

type DataTableWrapperProps = ComponentProps<typeof Container> &
  PropsWithChildren<{
    count: number;
    cta: {
      label: string;
      onClick: () => void;
    };
    emptyProps: Omit<ComponentProps<typeof Empty>, "cta">;
  }>;
