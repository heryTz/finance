"use server";
import { createServerFn } from "@tanstack/react-start";
import { CancelExpenseService } from "src/server/application/expense/cancel-expense.service";
import { PayExpenseService } from "src/server/application/expense/pay-expense.service";
import { UpdateExpenseService } from "src/server/application/expense/update-expense.service";
import { resolveOwnedTags } from "src/server/application/tag/resolve-owned-tags";
import { authMiddleware } from "src/server/auth/middleware";
import { Id } from "src/server/domain/shared/value-object/id";
import { db } from "src/server/infrastructure/db/client";
import { DrizzleExpenseCancellationRepository } from "src/server/infrastructure/expense/drizzle-expense-cancellation.repository";
import { DrizzleExpenseRepository } from "src/server/infrastructure/expense/drizzle-expense.repository";
import { DrizzleGetExpenseCancelPreviewQuery } from "src/server/infrastructure/expense/drizzle-get-expense-cancel-preview.query";
import { DrizzlePotRepository } from "src/server/infrastructure/pot-collection/drizzle-pot.repository";
import { DrizzleUnitOfWork } from "src/server/infrastructure/shared/drizzle-unit-of-work";
import { DrizzleTagRepository } from "src/server/infrastructure/tag/drizzle-tag.repository";
import { z } from "zod";

const tagSchema = z.object({
  id: z.string().nullable(),
  name: z.string().trim().min(1),
});

const payExpenseSchema = z.object({
  name: z.string().trim().min(1),
  tags: z.array(tagSchema),
  drawFrom: z.array(
    z.object({ potId: z.string(), amount: z.number().positive() }),
  ),
  createdAt: z.coerce.date().optional(),
});

export const payExpenseFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(payExpenseSchema)
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;

    const resolvedTags = await resolveOwnedTags(
      new DrizzleTagRepository(),
      new Id(userId),
      data.tags,
    );

    const uow = new DrizzleUnitOfWork();
    const result = await new PayExpenseService({
      expenseRepo: new DrizzleExpenseRepository(uow),
      potRepo: new DrizzlePotRepository(uow),
      uow,
    }).execute({
      name: data.name,
      drawFrom: data.drawFrom,
      tags: resolvedTags,
      userId,
      createdAt: data.createdAt,
    });

    return { id: result.id };
  });

export const getExpenseFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    const uow = new DrizzleUnitOfWork();
    const expenseRepo = new DrizzleExpenseRepository(uow);
    const expense = await expenseRepo.findOne(new Id(data.id), new Id(userId));
    if (!expense) throw new Error("Expense not found");

    const d = expense.data;
    return {
      id: d.id.value,
      name: d.name.value,
      amount: d.amount.rawCents,
      createdAt: d.createdAt.value,
      tags: d.tags.map((t) => ({
        id: t.data.id.value,
        name: t.data.name.value,
      })),
      allocations: d.allocations.map((a) => ({
        potId: a.data.potId.value,
        amount: a.data.amount.rawCents,
      })),
    };
  });

const updateExpenseSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1),
  date: z.coerce.date(),
  tags: z.array(tagSchema),
});

export const updateExpenseFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(updateExpenseSchema)
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;

    const resolvedTags = await resolveOwnedTags(
      new DrizzleTagRepository(),
      new Id(userId),
      data.tags,
    );

    const uow = new DrizzleUnitOfWork();
    await new UpdateExpenseService({
      expenseRepo: new DrizzleExpenseRepository(uow),
      uow,
    }).execute({
      id: data.id,
      name: data.name,
      date: data.date,
      tags: resolvedTags,
      userId,
    });

    return { id: data.id };
  });

const cancelExpenseSchema = z.object({ id: z.string() });

export const cancelExpenseFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(cancelExpenseSchema)
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    const uow = new DrizzleUnitOfWork();
    await new CancelExpenseService({
      expenseRepo: new DrizzleExpenseRepository(uow),
      potRepo: new DrizzlePotRepository(uow),
      cancellationRepo: new DrizzleExpenseCancellationRepository(uow),
      uow,
    }).execute({ expenseId: data.id, userId });
    return { id: data.id };
  });

const expenseCancelPreviewSchema = z.object({ id: z.string() });

export const getExpenseCancelPreviewFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(expenseCancelPreviewSchema)
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    return new DrizzleGetExpenseCancelPreviewQuery(db).execute(data.id, userId);
  });
