import { useRouteContext } from "@tanstack/react-router";

export function useAuthenticatedUser() {
  const { user } = useRouteContext({ from: "/_authenticated" });
  return user;
}
