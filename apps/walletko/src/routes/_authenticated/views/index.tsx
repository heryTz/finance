import { createFileRoute } from "@tanstack/react-router";
import { tagsQuery } from "src/features/tags/queries";
import { viewsQuery } from "src/features/views/queries";
import { ViewsPage } from "src/features/views/views-page";
import { queryClient } from "src/shared/lib/query-client";

export const Route = createFileRoute("/_authenticated/views/")({
  loader: async () => {
    await Promise.all([
      queryClient.ensureQueryData(viewsQuery),
      queryClient.ensureQueryData(tagsQuery),
    ]);
  },
  component: ViewsPage,
});
