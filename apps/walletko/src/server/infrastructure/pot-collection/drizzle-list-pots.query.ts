import {
  expenseAllocations,
  potAllocations,
  pots,
} from "src/server/infrastructure/db/schema";
import type { DrizzleDb } from "src/server/infrastructure/db/client";
import { eq, inArray, sql, sum } from "drizzle-orm";

export type PotWithBalanceDTO = {
  id: string;
  name: string;
  percentage: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  balance: number; // in cents
};

export class DrizzleListPotsQuery {
  constructor(private readonly db: DrizzleDb) {}

  async execute(userId: string): Promise<PotWithBalanceDTO[]> {
    const userPotIds = this.db
      .select({ id: pots.id })
      .from(pots)
      .where(eq(pots.userId, userId));

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
        userId: pots.userId,
        createdAt: pots.createdAt,
        updatedAt: pots.updatedAt,
        balance:
          sql<number>`COALESCE(${incomeSubquery.total}, 0) - COALESCE(${expenseSubquery.total}, 0)`.mapWith(
            Number,
          ),
      })
      .from(pots)
      .leftJoin(incomeSubquery, eq(incomeSubquery.potId, pots.id))
      .leftJoin(expenseSubquery, eq(expenseSubquery.potId, pots.id))
      .where(eq(pots.userId, userId));
  }
}
