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
      <Component {...props} />
    </AdminGuard>
  );
}
