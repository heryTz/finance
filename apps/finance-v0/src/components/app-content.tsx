import { ComponentProps, PropsWithChildren, ReactNode } from "react";
import { AppBreadcrumb } from "./app-breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";

export function AppContent({ action, title, children }: AppContentProps) {
  return (
    <>
      <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-[54px] flex h-[54px] shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">{title}</h1>
        </div>
        <div className="px-4">{action}</div>
      </header>
      <main className="flex flex-1 flex-col p-4">{children}</main>
    </>
  );
}

type AppContentProps = PropsWithChildren<{
  title: string;
  action?: ReactNode;
  breadcrumb?: ComponentProps<typeof AppBreadcrumb>["links"];
}>;
