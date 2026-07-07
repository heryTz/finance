import { queryOptions } from "@tanstack/react-query";
import { getTotalBalanceFn, listPotsFn } from "src/server/functions/pots.fn";

export const potKeys = {
  all: ["pots"] as const,
  list: () => [...potKeys.all] as const,
  totalBalance: () => [...potKeys.all, "total-balance"] as const,
};

export const potsQuery = queryOptions({
  queryKey: potKeys.list(),
  queryFn: () => listPotsFn(),
});

export const totalBalanceQuery = queryOptions({
  queryKey: potKeys.totalBalance(),
  queryFn: () => getTotalBalanceFn(),
});
