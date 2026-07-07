import { queryOptions } from "@tanstack/react-query";
import {
  getViewFn,
  getViewStatsFn,
  getViewYearStatsFn,
  listViewsFn,
} from "src/server/functions/views.fn";

export const viewKeys = {
  all: ["views"] as const,
  list: () => [...viewKeys.all] as const,
  detail: (id: string) => [...viewKeys.all, id] as const,
  stats: (id: string) => [...viewKeys.all, "stats", id] as const,
  yearStats: (id: string, year?: number) =>
    year !== undefined
      ? ([...viewKeys.all, "year-stats", id, year] as const)
      : ([...viewKeys.all, "year-stats", id] as const),
};

export const viewsQuery = queryOptions({
  queryKey: viewKeys.list(),
  queryFn: () => listViewsFn(),
});

export const viewQuery = (id: string) =>
  queryOptions({
    queryKey: viewKeys.detail(id),
    queryFn: () => getViewFn({ data: { id } }),
  });

export const viewStatsQuery = (id: string) =>
  queryOptions({
    queryKey: viewKeys.stats(id),
    queryFn: () => getViewStatsFn({ data: { id } }),
  });

export const viewYearStatsQuery = (id: string, year: number) =>
  queryOptions({
    queryKey: viewKeys.yearStats(id, year),
    queryFn: () => getViewYearStatsFn({ data: { id, year } }),
  });
