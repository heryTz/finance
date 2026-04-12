import { db } from "@/server/infrastructure/db/client";
import { Income } from "@/server/domain/income/income";
import { IncomeRepository } from "@/server/domain/income/income.repository";
import { PotAllocation } from "@/server/domain/income/pot-allocation";
import { UnitOfWork } from "@/server/domain/shared/unit-of-work";
import { Datetime } from "@/server/domain/shared/value-object/datetime";
import { Id } from "@/server/domain/shared/value-object/id";
import { Money } from "@/server/domain/shared/value-object/money";
import { Name } from "@/server/domain/shared/value-object/name";
import { Tag } from "@/server/domain/tag/tag";
import {
  potAllocationsV2,
  tagsV2,
  transactionTagsV2,
  transactionsV2,
} from "@/server/infrastructure/db/schema";
import { DrizzleTx } from "@/server/infrastructure/shared/drizzle-unit-of-work";
import { and, eq } from "drizzle-orm";

export class DrizzleIncomeRepository implements IncomeRepository {
  constructor(private uow: UnitOfWork<DrizzleTx>) {}

  async save(income: Income): Promise<void> {
    const d = income.data;
    this.uow.register(async (tx) => {
      await tx.insert(transactionsV2).values({
        id: d.id.value,
        type: "income",
        name: d.name.value,
        amount: d.amount.rawCents,
        userId: d.userId.value,
        createdAt: d.createdAt.value,
      });

      await tx.insert(potAllocationsV2).values(
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
          .insert(tagsV2)
          .values(
            d.tags.map((tag) => ({
              id: tag.data.id.value,
              name: tag.data.name.value,
              userId: tag.data.userId.value,
              createdAt: tag.data.createdAt.value,
            })),
          )
          .onConflictDoNothing();

        await tx.insert(transactionTagsV2).values(
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
      .from(transactionsV2)
      .where(
        and(
          eq(transactionsV2.id, id.value),
          eq(transactionsV2.type, "income"),
          eq(transactionsV2.userId, userId.value),
        ),
      );

    if (!txRow) return null;

    const [allocationRows, tagRows] = await Promise.all([
      db
        .select()
        .from(potAllocationsV2)
        .where(eq(potAllocationsV2.transactionId, id.value)),
      db
        .select({
          id: tagsV2.id,
          name: tagsV2.name,
          userId: tagsV2.userId,
          createdAt: tagsV2.createdAt,
        })
        .from(transactionTagsV2)
        .leftJoin(tagsV2, eq(transactionTagsV2.tagId, tagsV2.id))
        .where(eq(transactionTagsV2.transactionId, id.value)),
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

    const tags = tagRows
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
      tags,
      allocations,
    });
  }
}
