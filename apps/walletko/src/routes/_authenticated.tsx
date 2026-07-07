import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ensureSession } from "src/server/auth/session";
import { AppLayout } from "src/shared/layout/app-layout";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => ensureSession(),
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});
