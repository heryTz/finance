"use server";
import { createServerFn } from "@tanstack/react-start";
import { AddPotService } from "src/server/application/pot/add-pot.service";
import { CreatePotTransferService } from "src/server/application/pot/create-pot-transfer.service";
import { ArchivePotService } from "src/server/application/pot/archive-pot.service";
import { EditAllocationService } from "src/server/application/pot/edit-allocation.service";
import { EditPotService } from "src/server/application/pot/edit-pot.service";
import { authMiddleware } from "src/server/auth/middleware";
import { db } from "src/server/infrastructure/db/client";
import { DrizzleGetTotalBalanceQuery } from "src/server/infrastructure/pot-collection/drizzle-get-total-balance.query";
import { DrizzleListPotsQuery } from "src/server/infrastructure/pot-collection/drizzle-list-pots.query";
import { DrizzlePotRepository } from "src/server/infrastructure/pot-collection/drizzle-pot.repository";
import { DrizzlePotTransferRepository } from "src/server/infrastructure/pot-collection/drizzle-pot-transfer.repository";
import { DrizzleUnitOfWork } from "src/server/infrastructure/shared/drizzle-unit-of-work";
import { z } from "zod";

export const listPotsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.session.user.id;
    const pots = await new DrizzleListPotsQuery(db).execute(userId);
    return pots.map(
      ({ id, name, percentage, balance, color, isDefault, createdAt }) => ({
        id,
        name,
        percentage,
        balance,
        color,
        isDefault,
        createdAt,
      }),
    );
  });

const addPotSchema = z
  .object({
    name: z.string().trim().min(1),
    color: z.string(),
    percentage: z.number().int().min(1).max(99),
    otherPots: z.array(
      z.object({ id: z.string(), percentage: z.number().int().min(1) }),
    ),
  })
  .refine(
    (d) =>
      d.percentage + d.otherPots.reduce((s, p) => s + p.percentage, 0) === 100,
    { message: "Percentages must sum to 100" },
  );

export const addPotFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(addPotSchema)
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    const uow = new DrizzleUnitOfWork();
    const result = await new AddPotService({
      potRepo: new DrizzlePotRepository(uow),
      uow,
    }).execute({ ...data, userId });
    return { id: result.id };
  });

const editPotSchema = z.object({
  potId: z.string(),
  name: z.string().trim().min(1),
  color: z.string(),
});

export const editPotFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(editPotSchema)
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    const uow = new DrizzleUnitOfWork();
    await new EditPotService({
      potRepo: new DrizzlePotRepository(uow),
      uow,
    }).execute({ ...data, userId });
  });

const editAllocationSchema = z
  .object({
    allPots: z.array(
      z.object({ id: z.string(), percentage: z.number().int().min(1) }),
    ),
  })
  .refine((d) => d.allPots.reduce((s, p) => s + p.percentage, 0) === 100, {
    message: "Percentages must sum to 100",
  });

export const editAllocationFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(editAllocationSchema)
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    const uow = new DrizzleUnitOfWork();
    await new EditAllocationService({
      potRepo: new DrizzlePotRepository(uow),
      uow,
    }).execute({ ...data, userId });
  });

const archivePotSchema = z
  .object({
    potId: z.string(),
    toPotId: z.string().optional(),
    remainingPotsPercentages: z.array(
      z.object({ id: z.string(), percentage: z.number().int().min(1) }),
    ),
  })
  .refine(
    (d) =>
      d.remainingPotsPercentages.reduce((s, p) => s + p.percentage, 0) === 100,
    { message: "Percentages must sum to 100" },
  );

export const archivePotFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(archivePotSchema)
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    const uow = new DrizzleUnitOfWork();
    await new ArchivePotService({
      potRepo: new DrizzlePotRepository(uow),
      transferRepo: new DrizzlePotTransferRepository(uow),
      uow,
    }).execute({ ...data, userId });
  });

export const getTotalBalanceFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.session.user.id;
    const totalBalance = await new DrizzleGetTotalBalanceQuery(db).execute(
      userId,
    );
    return { totalBalance };
  });

const createPotTransferSchema = z.object({
  fromPotId: z.string(),
  toPotId: z.string(),
  amount: z.number().positive(),
});

export const createPotTransferFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(createPotTransferSchema)
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    const uow = new DrizzleUnitOfWork();
    await new CreatePotTransferService({
      potRepo: new DrizzlePotRepository(uow),
      transferRepo: new DrizzlePotTransferRepository(uow),
      uow,
    }).execute({ ...data, userId });
  });
