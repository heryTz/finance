import { db } from "src/server/infrastructure/db/client";
import { Expense } from "src/server/domain/expense/expense";
import { ExpenseAllocation } from "src/server/domain/expense/expense-allocation";
import type { ExpenseRepository } from "src/server/domain/expense/expense.repository";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
import { Id } from "src/server/domain/shared/value-object/id";
import { Money } from "src/server/domain/shared/value-object/money";
import { Name } from "src/server/domain/shared/value-object/name";
import { Tag } from "src/server/domain/tag/tag";
import {
  expenseAllocations,
  tags,
  transactionTags,
  transactions,
} from "src/server/infrastructure/db/schema";
import type { DrizzleTx } from "src/server/infrastructure/shared/drizzle-unit-of-work";
import { and, eq } from "drizzle-orm";

export class DrizzleExpenseRepository implements ExpenseRepository {
  constructor(private uow: UnitOfWork<DrizzleTx>) {}

  async save(expense: Expense): Promise<void> {
    const d = expense.data;
    this.uow.register(async (tx) => {
      await tx.insert(transactions).values({
        id: d.id.value,
        type: "expense",
        name: d.name.value,
        amount: d.amount.rawCents,
        userId: d.userId.value,
        createdAt: d.createdAt.value,
      });

      if (d.allocations.length > 0) {
        await tx.insert(expenseAllocations).values(
          d.allocations.map((a) => ({
            id: a.data.id.value,
            transactionId: d.id.value,
            potId: a.data.potId.value,
            amount: a.data.amount.rawCents,
            createdAt: a.data.createdAt.value,
          })),
        );
      }

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

  async findOne(id: Id, userId: Id): Promise<Expense | null> {
    const [txRow] = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.id, id.value),
          eq(transactions.type, "expense"),
          eq(transactions.userId, userId.value),
        ),
      );

    if (!txRow) return null;

    const [allocationRows, tagRows] = await Promise.all([
      db
        .select()
        .from(expenseAllocations)
        .where(eq(expenseAllocations.transactionId, id.value)),
      db
        .select({
          id: tags.id,
          name: tags.name,
          userId: tags.userId,
          createdAt: tags.createdAt,
        })
        .from(transactionTags)
        .leftJoin(tags, eq(transactionTags.tagId, tags.id))
        .where(eq(transactionTags.transactionId, id.value)),
    ]);

    const allocations = allocationRows.map(
      (row) =>
        new ExpenseAllocation({
          id: new Id(row.id),
          expenseId: new Id(txRow.id),
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

    return new Expense({
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
}
