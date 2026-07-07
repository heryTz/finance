import { and, eq } from "drizzle-orm";
import { Income } from "src/server/domain/income/income";
import type { IncomeRepository } from "src/server/domain/income/income.repository";
import { PotAllocation } from "src/server/domain/income/pot-allocation";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
import { Id } from "src/server/domain/shared/value-object/id";
import { Money } from "src/server/domain/shared/value-object/money";
import { Name } from "src/server/domain/shared/value-object/name";
import { Tag } from "src/server/domain/tag/tag";
import { db } from "src/server/infrastructure/db/client";
import {
  potAllocations,
  tags,
  transactions,
  transactionTags,
} from "src/server/infrastructure/db/schema";
import type { DrizzleTx } from "src/server/infrastructure/shared/drizzle-unit-of-work";

export class DrizzleIncomeRepository implements IncomeRepository {
  constructor(private uow: UnitOfWork<DrizzleTx>) {}

  async save(income: Income): Promise<void> {
    const d = income.data;
    this.uow.register(async (tx) => {
      await tx.insert(transactions).values({
        id: d.id.value,
        type: "income",
        name: d.name.value,
        amount: d.amount.rawCents,
        userId: d.userId.value,
        createdAt: d.createdAt.value,
      });

      await tx.insert(potAllocations).values(
        d.allocations.map((a) => ({
          id: a.data.id.value,
          transactionId: d.id.value,
          potId: a.data.potId.value,
          amount: a.data.amount.rawCents,
          createdAt: a.data.createdAt.value,
        })),
      );

      if (d.tags.length > 0) {
        await tx
          .insert(tags)
          .values(
            d.tags.map((tag) => ({
              id: tag.data.id.value,
              name: tag.data.name.value,
              userId: tag.data.userId.value,
              createdAt: tag.data.createdAt.value,
            })),
          )
          .onConflictDoNothing();

        await tx.insert(transactionTags).values(
          d.tags.map((tag) => ({
            transactionId: d.id.value,
            tagId: tag.data.id.value,
          })),
        );
      }
    });
  }

  async update(income: Income): Promise<void> {
    const d = income.data;
    this.uow.register(async (tx) => {
      await tx
        .update(transactions)
        .set({ name: d.name.value, createdAt: d.createdAt.value })
        .where(
          and(
            eq(transactions.id, d.id.value),
            eq(transactions.userId, d.userId.value),
            eq(transactions.type, "income"),
          ),
        );

      await tx
        .delete(transactionTags)
        .where(eq(transactionTags.transactionId, d.id.value));

      if (d.tags.length > 0) {
        await tx
          .insert(tags)
          .values(
            d.tags.map((tag) => ({
              id: tag.data.id.value,
              name: tag.data.name.value,
              userId: tag.data.userId.value,
              createdAt: tag.data.createdAt.value,
            })),
          )
          .onConflictDoNothing();

        await tx.insert(transactionTags).values(
          d.tags.map((tag) => ({
            transactionId: d.id.value,
            tagId: tag.data.id.value,
          })),
        );
      }
    });
  }

  async findOne(id: Id, userId: Id): Promise<Income | null> {
    const [txRow] = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.id, id.value),
          eq(transactions.type, "income"),
          eq(transactions.userId, userId.value),
        ),
      );

    if (!txRow) return null;

    const [allocationRows, tagRows] = await Promise.all([
      db
        .select()
        .from(potAllocations)
        .where(eq(potAllocations.transactionId, id.value)),
      db
        .select({
          id: tags.id,
          name: tags.name,
          userId: tags.userId,
          createdAt: tags.createdAt,
        })
        .from(transactionTags)
        .innerJoin(
          tags,
          and(
            eq(transactionTags.tagId, tags.id),
            eq(tags.userId, userId.value),
          ),
        )
        .where(eq(transactionTags.transactionId, id.value)),
    ]);

    const allocations = allocationRows.map(
      (row) =>
        new PotAllocation({
          id: new Id(row.id),
          incomeId: new Id(txRow.id),
          potId: new Id(row.potId),
          amount: Money.fromCents(row.amount),
          createdAt: new Datetime(row.createdAt),
          updatedAt: row.updatedAt ? new Datetime(row.updatedAt) : null,
        }),
    );

    const tagEntities = tagRows
      .filter(
        (
          row,
        ): row is {
          id: string;
          name: string;
          userId: string;
          createdAt: Date;
        } => row.id !== null,
      )
      .map(
        (row) =>
          new Tag({
            id: new Id(row.id),
            name: new Name(row.name),
            userId: new Id(row.userId),
            createdAt: new Datetime(row.createdAt),
            updatedAt: null,
          }),
      );

    return new Income({
      id: new Id(txRow.id),
      name: new Name(txRow.name),
      amount: Money.fromCents(txRow.amount),
      userId: new Id(txRow.userId),
      createdAt: new Datetime(txRow.createdAt),
      updatedAt: txRow.updatedAt ? new Datetime(txRow.updatedAt) : null,
      tags: tagEntities,
      allocations,
    });
  }

  async delete(id: Id, userId: Id): Promise<void> {
    this.uow.register(async (tx) => {
      await tx
        .delete(transactions)
        .where(
          and(
            eq(transactions.id, id.value),
            eq(transactions.userId, userId.value),
            eq(transactions.type, "income"),
          ),
        );
    });
  }

  async markCanceled(id: Id, userId: Id): Promise<void> {
    this.uow.register(async (tx) => {
      const updated = await tx
        .update(transactions)
        .set({ type: "canceled_income" })
        .where(
          and(
            eq(transactions.id, id.value),
            eq(transactions.userId, userId.value),
            eq(transactions.type, "income"),
          ),
        )
        .returning({ id: transactions.id });
      if (updated.length === 0) {
        throw new Error("Income is not active and cannot be cancelled");
      }
    });
  }
}
