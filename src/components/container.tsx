import { ComponentProps, PropsWithChildren, ReactNode } from "react";
import { AppBreadcrumb } from "./app-breadcrumb";

export function Container({
  breadcrumb,
  filter,
  action,
  title,
  children,
}: ContainerProps) {
  return (
    <>
      <div className="grid gap-2 mb-4">
        {breadcrumb && (
          <AppBreadcrumb
            links={[{ label: "Home", path: "/" }, ...breadcrumb]}
          />
        )}
        <div className="flex justify-between items-center gap-4">
          <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
          {action}
        </div>
        {filter}
      </div>
      {children}
    </>
  );
}

type ContainerProps = PropsWithChildren<{
  title: string;
  action?: ReactNode;
  filter?: ReactNode;
  breadcrumb?: ComponentProps<typeof AppBreadcrumb>["links"];
}>;
