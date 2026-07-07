import { and, desc, eq, inArray, isNull, sql, sum } from "drizzle-orm";
import type { DrizzleDb } from "src/server/infrastructure/db/client";
import {
  expenseAllocations,
  potAllocations,
  pots,
} from "src/server/infrastructure/db/schema";
import type { PotWithBalanceDTO } from "src/server/infrastructure/pot-collection/drizzle-list-pots.query";

export class DrizzleListTopPotsQuery {
  constructor(private readonly db: DrizzleDb) {}

  async execute(userId: string, limit: number): Promise<PotWithBalanceDTO[]> {
    const userPotIds = this.db
      .select({ id: pots.id })
      .from(pots)
      .where(and(eq(pots.userId, userId), isNull(pots.archivedAt)));

    const incomeSubquery = this.db
      .select({
        potId: potAllocations.potId,
        total: sum(potAllocations.amount).as("income_total"),
      })
      .from(potAllocations)
      .where(inArray(potAllocations.potId, userPotIds))
      .groupBy(potAllocations.potId)
      .as("income");

    const expenseSubquery = this.db
      .select({
        potId: expenseAllocations.potId,
        total: sum(expenseAllocations.amount).as("expense_total"),
      })
      .from(expenseAllocations)
      .where(inArray(expenseAllocations.potId, userPotIds))
      .groupBy(expenseAllocations.potId)
      .as("expense");

    return this.db
      .select({
        id: pots.id,
        name: pots.name,
        percentage: pots.percentage,
        color: pots.color,
        isDefault: pots.isDefault,
        createdAt: pots.createdAt,
        balance:
          sql<number>`COALESCE(${incomeSubquery.total}, 0) - COALESCE(${expenseSubquery.total}, 0)`.mapWith(
            Number,
          ),
      })
      .from(pots)
      .leftJoin(incomeSubquery, eq(incomeSubquery.potId, pots.id))
      .leftJoin(expenseSubquery, eq(expenseSubquery.potId, pots.id))
      .where(and(eq(pots.userId, userId), isNull(pots.archivedAt)))
      .orderBy(desc(pots.isDefault), desc(pots.percentage))
      .limit(limit);
  }
}
