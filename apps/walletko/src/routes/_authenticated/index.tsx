import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "src/features/dashboard/dashboard-page";
import {
  overviewStatsQuery,
  topPotsQuery,
  yearStatsQuery,
} from "src/features/dashboard/queries";
import { queryClient } from "src/shared/lib/query-client";

export const Route = createFileRoute("/_authenticated/")({
  loader: async () => {
    const year = new Date().getFullYear();
    await Promise.all([
      queryClient.ensureQueryData(overviewStatsQuery),
      queryClient.ensureQueryData(topPotsQuery()),
      queryClient.ensureQueryData(yearStatsQuery(year)),
    ]);
  },
  component: DashboardPage,
});
