import { useLoaderData } from "@tanstack/react-router";

export function useAppMeta() {
  return useLoaderData({ from: "__root__" });
}
