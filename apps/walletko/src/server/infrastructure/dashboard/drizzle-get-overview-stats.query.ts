import { and, eq, inArray, isNull, sql, sum } from "drizzle-orm";
import type { DrizzleDb } from "src/server/infrastructure/db/client";
import {
  expenseAllocations,
  potAllocations,
  pots,
  transactions,
} from "src/server/infrastructure/db/schema";

export type OverviewStatsDTO = {
  totalBalance: number;
  monthIncome: number;
  monthExpense: number;
  allTimeIncome: number;
  allTimeExpense: number;
};

export class DrizzleGetOverviewStatsQuery {
  constructor(private readonly db: DrizzleDb) {}

  async execute(userId: string): Promise<OverviewStatsDTO> {
    const userPotIds = this.db
      .select({ id: pots.id })
      .from(pots)
      .where(and(eq(pots.userId, userId), isNull(pots.archivedAt)));

    const currentMonth = sql`DATE_TRUNC('month', ${transactions.createdAt}) = DATE_TRUNC('month', NOW())`;

    const [
      [allIncomeRow],
      [allExpenseRow],
      [monthIncomeRow],
      [monthExpenseRow],
    ] = await Promise.all([
      this.db
        .select({
          total:
            sql<number>`COALESCE(${sum(potAllocations.amount)}, 0)`.mapWith(
              Number,
            ),
        })
        .from(potAllocations)
        .innerJoin(
          transactions,
          eq(transactions.id, potAllocations.transactionId),
        )
        .where(
          and(
            inArray(potAllocations.potId, userPotIds),
            eq(transactions.type, "income"),
          ),
        ),
      this.db
        .select({
          total:
            sql<number>`COALESCE(${sum(expenseAllocations.amount)}, 0)`.mapWith(
              Number,
            ),
        })
        .from(expenseAllocations)
        .innerJoin(
          transactions,
          eq(transactions.id, expenseAllocations.transactionId),
        )
        .where(
          and(
            inArray(expenseAllocations.potId, userPotIds),
            eq(transactions.type, "expense"),
          ),
        ),
      this.db
        .select({
          total:
            sql<number>`COALESCE(${sum(potAllocations.amount)}, 0)`.mapWith(
              Number,
            ),
        })
        .from(potAllocations)
        .innerJoin(
          transactions,
          eq(transactions.id, potAllocations.transactionId),
        )
        .where(
          and(
            inArray(potAllocations.potId, userPotIds),
            currentMonth,
            eq(transactions.type, "income"),
          ),
        ),
      this.db
        .select({
          total:
            sql<number>`COALESCE(${sum(expenseAllocations.amount)}, 0)`.mapWith(
              Number,
            ),
        })
        .from(expenseAllocations)
        .innerJoin(
          transactions,
          eq(transactions.id, expenseAllocations.transactionId),
        )
        .where(
          and(
            inArray(expenseAllocations.potId, userPotIds),
            currentMonth,
            eq(transactions.type, "expense"),
          ),
        ),
    ]);

    return {
      totalBalance: (allIncomeRow?.total ?? 0) - (allExpenseRow?.total ?? 0),
      monthIncome: monthIncomeRow?.total ?? 0,
      monthExpense: monthExpenseRow?.total ?? 0,
      allTimeIncome: allIncomeRow?.total ?? 0,
      allTimeExpense: allExpenseRow?.total ?? 0,
    };
  }
}
