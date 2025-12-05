"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminGuard } from "@/lib/admin-guard";
import { PropsWithChildren } from "react";

export function Component({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

export default function Layout(props: PropsWithChildren) {
  return (
    <AdminGuard>
      <Component /* @next-codemod-error 'props' is used with spread syntax (...). Any asynchronous properties of 'props' must be awaited when accessed. */
        {...props}
      />
    </AdminGuard>
  );
}
