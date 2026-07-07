import { createFileRoute } from "@tanstack/react-router";
import { VerifyPage } from "src/features/auth/verify-page";

type SearchParams = { email?: string };

export const Route = createFileRoute("/login_/verify")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    email: typeof search.email === "string" ? search.email : undefined,
  }),
  component: VerifyPage,
});
