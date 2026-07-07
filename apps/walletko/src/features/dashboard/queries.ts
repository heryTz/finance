import { queryOptions } from "@tanstack/react-query";
import {
  getOverviewStatsFn,
  getYearStatsFn,
  listTopPotsFn,
} from "src/server/functions/dashboard.fn";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: () => [...dashboardKeys.all, "overview"] as const,
  topPots: (limit: number) =>
    [...dashboardKeys.all, "top-pots", limit] as const,
  yearStats: (year: number) =>
    [...dashboardKeys.all, "year-stats", year] as const,
};

export const overviewStatsQuery = queryOptions({
  queryKey: dashboardKeys.overview(),
  queryFn: () => getOverviewStatsFn(),
});

export const topPotsQuery = (limit = 4) =>
  queryOptions({
    queryKey: dashboardKeys.topPots(limit),
    queryFn: () => listTopPotsFn({ data: { limit } }),
  });

export const yearStatsQuery = (year: number) =>
  queryOptions({
    queryKey: dashboardKeys.yearStats(year),
    queryFn: () => getYearStatsFn({ data: { year } }),
  });
