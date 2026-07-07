import { and, eq, sql } from "drizzle-orm";
import type { DrizzleDb } from "src/server/infrastructure/db/client";
import {
  expenseAllocations,
  pots,
  transactions,
} from "src/server/infrastructure/db/schema";

export type ExpenseCancelPreviewLine = {
  potId: string;
  potName: string;
  amount: number;
  resultingBalance: number | null;
  redirected: boolean;
};

export type ExpenseCancelPreviewDTO = {
  name: string;
  lines: ExpenseCancelPreviewLine[];
  defaultPotName: string;
  redirectTotal: number;
};

export class DrizzleGetExpenseCancelPreviewQuery {
  constructor(private readonly db: DrizzleDb) {}

  async execute(
    id: string,
    userId: string,
  ): Promise<ExpenseCancelPreviewDTO | null> {
    const [tx] = await this.db
      .select({ name: transactions.name })
      .from(transactions)
      .where(
        and(
          eq(transactions.id, id),
          eq(transactions.userId, userId),
          eq(transactions.type, "expense"),
        ),
      );

    if (!tx) return null;

    const lineRows = await this.db
      .select({
        potId: pots.id,
        potName: pots.name,
        amount: expenseAllocations.amount,
        archivedAt: pots.archivedAt,
      })
      .from(expenseAllocations)
      .innerJoin(pots, eq(pots.id, expenseAllocations.potId))
      .where(eq(expenseAllocations.transactionId, id));

    const balanceRows = await this.db.execute<{ id: string; balance: string }>(
      sql`
        SELECT p.id,
          COALESCE(inc.total, 0) - COALESCE(exp.total, 0) AS balance
        FROM pots p
        LEFT JOIN (
          SELECT pot_id, SUM(amount) AS total FROM pot_allocations GROUP BY pot_id
        ) inc ON inc.pot_id = p.id
        LEFT JOIN (
          SELECT pot_id, SUM(amount) AS total FROM expense_allocations GROUP BY pot_id
        ) exp ON exp.pot_id = p.id
        WHERE p.user_id = ${userId}
        AND p.archived_at IS NULL
      `,
    );

    const balanceByPot = new Map(
      balanceRows.rows.map((row) => [row.id, Number(row.balance)]),
    );

    const [defaultPot] = await this.db
      .select({ name: pots.name })
      .from(pots)
      .where(and(eq(pots.userId, userId), eq(pots.isDefault, true)));

    const lines = lineRows.map((row): ExpenseCancelPreviewLine => {
      if (row.archivedAt !== null) {
        return {
          potId: row.potId,
          potName: row.potName,
          amount: row.amount,
          resultingBalance: null,
          redirected: true,
        };
      }
      const balance = balanceByPot.get(row.potId) ?? 0;
      return {
        potId: row.potId,
        potName: row.potName,
        amount: row.amount,
        resultingBalance: balance + row.amount,
        redirected: false,
      };
    });

    const redirectTotal = lines
      .filter((line) => line.redirected)
      .reduce((sum, line) => sum + line.amount, 0);

    return {
      name: tx.name,
      lines,
      defaultPotName: defaultPot?.name ?? "",
      redirectTotal,
    };
  }
}
