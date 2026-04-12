import { ComponentProps, PropsWithChildren } from "react";
import { AppContent } from "./app-content";
import { Empty } from "./empty";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

export function DataTableWrapper({
  cta,
  children,
  action,
  count,
  emptyProps,
  title,
  filter,
  breadcrumb,
}: DataTableWrapperProps) {
  return (
    <AppContent
      title={title}
      breadcrumb={breadcrumb}
      action={
        <>
          {count > 0 && (
            <Button size={"sm"} StartIcon={PlusIcon} onClick={cta.onClick}>
              {cta.label}
            </Button>
          )}
          {action}
        </>
      }
    >
      {count === 0 ? (
        <Empty
          withBorder
          {...emptyProps}
          className={cn("flex-1", emptyProps.className)}
          cta={cta}
        />
      ) : (
        <div className="grid gap-4">
          {filter}
          {children}
        </div>
      )}
    </AppContent>
  );
}

type DataTableWrapperProps = ComponentProps<typeof AppContent> &
  PropsWithChildren<{
    count: number;
    cta: {
      label: string;
      onClick: () => void;
    };
    emptyProps: Omit<ComponentProps<typeof Empty>, "cta">;
    filter?: React.ReactNode;
  }>;
