"use server";
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "src/server/auth/middleware";
import { db } from "src/server/infrastructure/db/client";
import { DrizzleListTransactionsQuery } from "src/server/infrastructure/transaction/drizzle-list-transactions.query";
import { z } from "zod";

const PAGE_SIZE = 20;

const listTransactionsSchema = z.object({
  types: z
    .array(
      z.enum([
        "income",
        "expense",
        "transfer",
        "canceled_income",
        "income_cancellation",
        "canceled_expense",
        "expense_cancellation",
      ]),
    )
    .optional(),
  name: z.string().trim().optional(),
  tagIds: z.array(z.string()).default([]),
  page: z.number().int().positive().default(1),
});

export const listTransactionsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(listTransactionsSchema)
  .handler(async ({ data, context }) => {
    const query = new DrizzleListTransactionsQuery(db);
    const { results, total } = await query.execute(context.session.user.id, {
      types: data.types,
      name: data.name || undefined,
      tagIds: data.tagIds.length > 0 ? data.tagIds : undefined,
      page: data.page,
      pageSize: PAGE_SIZE,
    });
    return {
      items: results,
      total,
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    };
  });
