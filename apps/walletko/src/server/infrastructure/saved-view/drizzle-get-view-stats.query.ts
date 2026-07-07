import { and, eq, sql, sum } from "drizzle-orm";
import type { DrizzleDb } from "src/server/infrastructure/db/client";
import { transactions } from "src/server/infrastructure/db/schema";
import type { ViewFilter } from "./view-filter.utils";
import { buildViewFilters } from "./view-filter.utils";

export type ViewStatsDTO = {
  netBalance: number;
  monthIncome: number;
  monthExpense: number;
  allTimeIncome: number;
  allTimeExpense: number;
};

export class DrizzleGetViewStatsQuery {
  constructor(private readonly db: DrizzleDb) {}

  async execute(userId: string, filter: ViewFilter): Promise<ViewStatsDTO> {
    const baseFilters = buildViewFilters(this.db, userId, filter);
    const currentMonth = sql`DATE_TRUNC('month', ${transactions.createdAt}) = DATE_TRUNC('month', NOW())`;

    const [
      [allIncomeRow],
      [allExpenseRow],
      [monthIncomeRow],
      [monthExpenseRow],
    ] = await Promise.all([
      this.db
        .select({
          total: sql<number>`COALESCE(${sum(transactions.amount)}, 0)`.mapWith(
            Number,
          ),
        })
        .from(transactions)
        .where(and(...baseFilters, eq(transactions.type, "income"))),
      this.db
        .select({
          total: sql<number>`COALESCE(${sum(transactions.amount)}, 0)`.mapWith(
            Number,
          ),
        })
        .from(transactions)
        .where(and(...baseFilters, eq(transactions.type, "expense"))),
      this.db
        .select({
          total: sql<number>`COALESCE(${sum(transactions.amount)}, 0)`.mapWith(
            Number,
          ),
        })
        .from(transactions)
        .where(
          and(...baseFilters, eq(transactions.type, "income"), currentMonth),
        ),
      this.db
        .select({
          total: sql<number>`COALESCE(${sum(transactions.amount)}, 0)`.mapWith(
            Number,
          ),
        })
        .from(transactions)
        .where(
          and(...baseFilters, eq(transactions.type, "expense"), currentMonth),
        ),
    ]);

    const allTimeIncome = allIncomeRow?.total ?? 0;
    const allTimeExpense = allExpenseRow?.total ?? 0;

    return {
      netBalance: allTimeIncome - allTimeExpense,
      monthIncome: monthIncomeRow?.total ?? 0,
      monthExpense: monthExpenseRow?.total ?? 0,
      allTimeIncome,
      allTimeExpense,
    };
  }
}
