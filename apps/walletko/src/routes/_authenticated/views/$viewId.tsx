import { createFileRoute } from "@tanstack/react-router";
import { tagsQuery } from "src/features/tags/queries";
import {
  viewQuery,
  viewStatsQuery,
  viewYearStatsQuery,
} from "src/features/views/queries";
import { ViewDetailPage } from "src/features/views/view-detail-page";
import { queryClient } from "src/shared/lib/query-client";

export const Route = createFileRoute("/_authenticated/views/$viewId")({
  loader: async ({ params: { viewId } }) => {
    const year = new Date().getFullYear();
    await Promise.all([
      queryClient.ensureQueryData(viewQuery(viewId)),
      queryClient.ensureQueryData(viewStatsQuery(viewId)),
      queryClient.ensureQueryData(viewYearStatsQuery(viewId, year)),
      queryClient.ensureQueryData(tagsQuery),
    ]);
  },
  component: ViewDetailPage,
});
