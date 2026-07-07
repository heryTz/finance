import { createFileRoute } from "@tanstack/react-router";
import { TAGS_PAGE_SIZE, tagsPagedQuery } from "src/features/tags/queries";
import { TagsPage } from "src/features/tags/tags-page";
import { queryClient } from "src/shared/lib/query-client";

export const Route = createFileRoute("/_authenticated/tags")({
  loader: async () => {
    await queryClient.ensureQueryData(tagsPagedQuery(1, TAGS_PAGE_SIZE));
  },
  component: TagsPage,
});
