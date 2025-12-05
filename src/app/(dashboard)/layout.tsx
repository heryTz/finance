import { AdminGuard } from "@/lib/admin-guard";
import { PropsWithChildren } from "react";
import { DashboardWrapper } from "./dashboard-wrapper";

export default async function Layout(props: PropsWithChildren) {
  return (
    <AdminGuard>
      <DashboardWrapper {...props} />
    </AdminGuard>
  );
}
