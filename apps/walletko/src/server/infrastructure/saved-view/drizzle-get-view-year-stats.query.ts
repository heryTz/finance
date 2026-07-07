import { and, asc, eq, sql, sum } from "drizzle-orm";
import type {
  MonthStatDTO,
  YearStatsDTO,
} from "src/server/infrastructure/dashboard/drizzle-get-year-stats.query";
import type { DrizzleDb } from "src/server/infrastructure/db/client";
import { transactions } from "src/server/infrastructure/db/schema";
import type { ViewFilter } from "./view-filter.utils";
import { buildViewFilters } from "./view-filter.utils";

export class DrizzleGetViewYearStatsQuery {
  constructor(private readonly db: DrizzleDb) {}

  async execute(
    userId: string,
    year: number,
    filter: ViewFilter,
  ): Promise<YearStatsDTO> {
    const baseFilters = buildViewFilters(this.db, userId, filter);
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
          total: sql<number>`COALESCE(${sum(transactions.amount)}, 0)`.mapWith(
            Number,
          ),
        })
        .from(transactions)
        .where(
          and(
            ...baseFilters,
            eq(transactions.type, "income"),
            sql`EXTRACT(year FROM ${transactions.createdAt}) < ${year}`,
          ),
        ),
      this.db
        .select({
          total: sql<number>`COALESCE(${sum(transactions.amount)}, 0)`.mapWith(
            Number,
          ),
        })
        .from(transactions)
        .where(
          and(
            ...baseFilters,
            eq(transactions.type, "expense"),
            sql`EXTRACT(year FROM ${transactions.createdAt}) < ${year}`,
          ),
        ),
      this.db
        .select({
          month: monthExpr,
          total: sql<number>`COALESCE(${sum(transactions.amount)}, 0)`.mapWith(
            Number,
          ),
        })
        .from(transactions)
        .where(
          and(
            ...baseFilters,
            eq(transactions.type, "income"),
            sql`EXTRACT(year FROM ${transactions.createdAt}) = ${year}`,
          ),
        )
        .groupBy(sql`EXTRACT(month FROM ${transactions.createdAt})`),
      this.db
        .select({
          month: monthExpr,
          total: sql<number>`COALESCE(${sum(transactions.amount)}, 0)`.mapWith(
            Number,
          ),
        })
        .from(transactions)
        .where(
          and(
            ...baseFilters,
            eq(transactions.type, "expense"),
            sql`EXTRACT(year FROM ${transactions.createdAt}) = ${year}`,
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
        .where(and(...baseFilters))
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
