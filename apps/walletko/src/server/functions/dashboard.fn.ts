"use server";
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "src/server/auth/middleware";
import { DrizzleGetOverviewStatsQuery } from "src/server/infrastructure/dashboard/drizzle-get-overview-stats.query";
import { DrizzleGetYearStatsQuery } from "src/server/infrastructure/dashboard/drizzle-get-year-stats.query";
import { DrizzleListTopPotsQuery } from "src/server/infrastructure/dashboard/drizzle-list-top-pots.query";
import { db } from "src/server/infrastructure/db/client";
import { z } from "zod";

export const getOverviewStatsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.session.user.id;
    return new DrizzleGetOverviewStatsQuery(db).execute(userId);
  });

const topPotsSchema = z.object({
  limit: z.number().int().min(1).max(20).default(4),
});

export const listTopPotsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(topPotsSchema)
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    return new DrizzleListTopPotsQuery(db).execute(userId, data.limit);
  });

const yearStatsSchema = z.object({
  year: z.number().int().min(2000).max(2100),
});

export const getYearStatsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(yearStatsSchema)
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    return new DrizzleGetYearStatsQuery(db).execute(userId, data.year);
  });
