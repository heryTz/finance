import { ComponentProps, PropsWithChildren } from "react";
import { Container } from "./container";
import { Button } from "./ui/button";
import { Empty } from "./empty";
import { cn } from "@/lib/utils";
import { Loader } from "./loader";
import { ErrorSection } from "./error-section";

export function DataTableWrapper({
  cta,
  children,
  action,
  count,
  emptyProps,
  error,
  loading,
  ...containerProps
}: DataTableWrapperProps) {
  return (
    <Container
      action={
        <>
          {!loading && count > 0 ? (
            <Button onClick={cta.onClick}>{cta.label}</Button>
          ) : null}
          {action}
        </>
      }
      {...containerProps}
    >
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorSection />
      ) : count === 0 ? (
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
    loading?: boolean;
    error?: unknown;
    cta: {
      label: string;
      onClick: () => void;
    };
    emptyProps: Omit<ComponentProps<typeof Empty>, "cta">;
  }>;
