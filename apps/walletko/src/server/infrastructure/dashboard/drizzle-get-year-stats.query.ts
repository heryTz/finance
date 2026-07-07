import { and, asc, eq, inArray, isNull, sql, sum } from "drizzle-orm";
import type { MonthStatDTO } from "src/server/contracts/dashboard";
import type { DrizzleDb } from "src/server/infrastructure/db/client";
import {
  expenseAllocations,
  potAllocations,
  pots,
  transactions,
} from "src/server/infrastructure/db/schema";
export type { MonthStatDTO };

export type YearStatsDTO = {
  months: MonthStatDTO[];
  availableYears: number[];
};

export class DrizzleGetYearStatsQuery {
  constructor(private readonly db: DrizzleDb) {}

  async execute(userId: string, year: number): Promise<YearStatsDTO> {
    const userPotIds = this.db
      .select({ id: pots.id })
      .from(pots)
      .where(and(eq(pots.userId, userId), isNull(pots.archivedAt)));

    const monthExpr =
      sql<number>`EXTRACT(month FROM ${transactions.createdAt})::int`.mapWith(
        Number,
      );

    const [
      [priorIncomeRow],
      [priorExpenseRow],
      monthlyIncomeRows,
      monthlyExpenseRows,
      yearRows,
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
            sql`EXTRACT(year FROM ${transactions.createdAt}) < ${year}`,
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
            sql`EXTRACT(year FROM ${transactions.createdAt}) < ${year}`,
            eq(transactions.type, "expense"),
          ),
        ),
      this.db
        .select({
          month: monthExpr,
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
            sql`EXTRACT(year FROM ${transactions.createdAt}) = ${year}`,
            eq(transactions.type, "income"),
          ),
        )
        .groupBy(sql`EXTRACT(month FROM ${transactions.createdAt})`),
      this.db
        .select({
          month: monthExpr,
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
            sql`EXTRACT(year FROM ${transactions.createdAt}) = ${year}`,
            eq(transactions.type, "expense"),
          ),
        )
        .groupBy(sql`EXTRACT(month FROM ${transactions.createdAt})`),
      this.db
        .select({
          year: sql<number>`EXTRACT(year FROM ${transactions.createdAt})::int`.mapWith(
            Number,
          ),
        })
        .from(transactions)
        .where(eq(transactions.userId, userId))
        .groupBy(sql`EXTRACT(year FROM ${transactions.createdAt})`)
        .orderBy(asc(sql`EXTRACT(year FROM ${transactions.createdAt})`)),
    ]);

    const startingNet =
      (priorIncomeRow?.total ?? 0) - (priorExpenseRow?.total ?? 0);
    const incomeByMonth = new Map(
      monthlyIncomeRows.map((r) => [r.month, r.total]),
    );
    const expenseByMonth = new Map(
      monthlyExpenseRows.map((r) => [r.month, r.total]),
    );

    let cumulative = startingNet;
    const months: MonthStatDTO[] = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const income = incomeByMonth.get(month) ?? 0;
      const expense = expenseByMonth.get(month) ?? 0;
      cumulative += income - expense;
      return { month, income, expense, cumulativeNet: cumulative };
    });

    return {
      months,
      availableYears: yearRows.map((r) => r.year),
    };
  }
}
