import {
  expenseAllocationsV2,
  potAllocationsV2,
  potsV2,
} from "@/server/infrastructure/db/schema";
import type { DrizzleDb } from "@/server/infrastructure/db/client";
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
      .select({ id: potsV2.id })
      .from(potsV2)
      .where(eq(potsV2.userId, userId));

    const incomeSubquery = this.db
      .select({
        potId: potAllocationsV2.potId,
        total: sum(potAllocationsV2.amount).as("income_total"),
      })
      .from(potAllocationsV2)
      .where(inArray(potAllocationsV2.potId, userPotIds))
      .groupBy(potAllocationsV2.potId)
      .as("income");

    const expenseSubquery = this.db
      .select({
        potId: expenseAllocationsV2.potId,
        total: sum(expenseAllocationsV2.amount).as("expense_total"),
      })
      .from(expenseAllocationsV2)
      .where(inArray(expenseAllocationsV2.potId, userPotIds))
      .groupBy(expenseAllocationsV2.potId)
      .as("expense");

    return this.db
      .select({
        id: potsV2.id,
        name: potsV2.name,
        percentage: potsV2.percentage,
        userId: potsV2.userId,
        createdAt: potsV2.createdAt,
        updatedAt: potsV2.updatedAt,
        balance:
          sql<number>`COALESCE(${incomeSubquery.total}, 0) - COALESCE(${expenseSubquery.total}, 0)`.mapWith(
            Number,
          ),
      })
      .from(potsV2)
      .leftJoin(incomeSubquery, eq(incomeSubquery.potId, potsV2.id))
      .leftJoin(expenseSubquery, eq(expenseSubquery.potId, potsV2.id))
      .where(eq(potsV2.userId, userId));
  }
}
