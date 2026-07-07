import { createFileRoute } from "@tanstack/react-router";
import { PotsPage } from "src/features/pots/pots-page";
import { potsQuery, totalBalanceQuery } from "src/features/pots/queries";
import { queryClient } from "src/shared/lib/query-client";

export const Route = createFileRoute("/_authenticated/pots")({
  loader: async () => {
    await Promise.all([
      queryClient.ensureQueryData(potsQuery),
      queryClient.ensureQueryData(totalBalanceQuery),
    ]);
  },
  component: PotsPage,
});
