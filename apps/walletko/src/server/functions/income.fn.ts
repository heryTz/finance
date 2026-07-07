"use server";
import { createServerFn } from "@tanstack/react-start";
import { CancelIncomeService } from "src/server/application/income/cancel-income.service";
import { ReceiveIncomeService } from "src/server/application/income/receive-income.service";
import { UpdateIncomeService } from "src/server/application/income/update-income.service";
import { resolveOwnedTags } from "src/server/application/tag/resolve-owned-tags";
import { authMiddleware } from "src/server/auth/middleware";
import { CancelIncomeBlockedError } from "src/server/domain/income/cancel-income-blocked.error";
import { Id } from "src/server/domain/shared/value-object/id";
import { db } from "src/server/infrastructure/db/client";
import { DrizzleGetIncomeCancelPreviewQuery } from "src/server/infrastructure/income/drizzle-get-income-cancel-preview.query";
import { DrizzleIncomeRepository } from "src/server/infrastructure/income/drizzle-income.repository";
import { DrizzleIncomeCancellationRepository } from "src/server/infrastructure/income/drizzle-income-cancellation.repository";
import { DrizzlePotRepository } from "src/server/infrastructure/pot-collection/drizzle-pot.repository";
import { DrizzleUnitOfWork } from "src/server/infrastructure/shared/drizzle-unit-of-work";
import { DrizzleTagRepository } from "src/server/infrastructure/tag/drizzle-tag.repository";
import { z } from "zod";

const receiveIncomeSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number().positive(),
  tags: z.array(
    z.object({ id: z.string().nullable(), name: z.string().trim().min(1) }),
  ),
  createdAt: z.coerce.date().optional(),
});

export const receiveIncomeFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(receiveIncomeSchema)
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;

    const resolvedTags = await resolveOwnedTags(
      new DrizzleTagRepository(),
      new Id(userId),
      data.tags,
    );

    const uow = new DrizzleUnitOfWork();
    const result = await new ReceiveIncomeService({
      incomeRepo: new DrizzleIncomeRepository(uow),
      potRepo: new DrizzlePotRepository(uow),
      uow,
    }).execute({
      name: data.name,
      amount: data.amount,
      tags: resolvedTags,
      userId,
      createdAt: data.createdAt,
    });

    return { id: result.id };
  });

export const getIncomeFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    const uow = new DrizzleUnitOfWork();
    const incomeRepo = new DrizzleIncomeRepository(uow);
    const income = await incomeRepo.findOne(new Id(data.id), new Id(userId));
    if (!income) throw new Error("Income not found");

    const d = income.data;
    return {
      id: d.id.value,
      name: d.name.value,
      amount: d.amount.rawCents,
      createdAt: d.createdAt.value,
      tags: d.tags.map((t) => ({
        id: t.data.id.value,
        name: t.data.name.value,
      })),
    };
  });

const updateIncomeSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1),
  date: z.coerce.date(),
  tags: z.array(
    z.object({ id: z.string().nullable(), name: z.string().trim().min(1) }),
  ),
});

export const updateIncomeFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(updateIncomeSchema)
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;

    const resolvedTags = await resolveOwnedTags(
      new DrizzleTagRepository(),
      new Id(userId),
      data.tags,
    );

    const uow = new DrizzleUnitOfWork();
    await new UpdateIncomeService({
      incomeRepo: new DrizzleIncomeRepository(uow),
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

const cancelIncomeSchema = z.object({ id: z.string() });

export const cancelIncomeFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(cancelIncomeSchema)
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    const uow = new DrizzleUnitOfWork();
    try {
      await new CancelIncomeService({
        incomeRepo: new DrizzleIncomeRepository(uow),
        potRepo: new DrizzlePotRepository(uow),
        cancellationRepo: new DrizzleIncomeCancellationRepository(uow),
        uow,
      }).execute({ incomeId: data.id, userId });
      return { blocked: false as const };
    } catch (err) {
      if (err instanceof CancelIncomeBlockedError) {
        return {
          blocked: true as const,
          code: "WOULD_CAUSE_NEGATIVE_BALANCE" as const,
          pots: err.pots,
        };
      }
      throw err;
    }
  });

const incomeCancelPreviewSchema = z.object({ id: z.string() });

export const getIncomeCancelPreviewFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(incomeCancelPreviewSchema)
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    return new DrizzleGetIncomeCancelPreviewQuery(db).execute(data.id, userId);
  });
