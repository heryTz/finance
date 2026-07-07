import { and, eq, sql } from "drizzle-orm";
import type { DrizzleDb } from "src/server/infrastructure/db/client";
import {
  potAllocations,
  pots,
  transactions,
} from "src/server/infrastructure/db/schema";

export type IncomeCancelPreviewLine = {
  potId: string;
  potName: string;
  amount: number;
  resultingBalance: number | null;
  status: "ok" | "shortfall" | "pot_archived";
  shortfall: number;
};

export type IncomeCancelPreviewDTO = {
  name: string;
  lines: IncomeCancelPreviewLine[];
  blocked: boolean;
};

export class DrizzleGetIncomeCancelPreviewQuery {
  constructor(private readonly db: DrizzleDb) {}

  async execute(
    id: string,
    userId: string,
  ): Promise<IncomeCancelPreviewDTO | null> {
    const [tx] = await this.db
      .select({ name: transactions.name })
      .from(transactions)
      .where(
        and(
          eq(transactions.id, id),
          eq(transactions.userId, userId),
          eq(transactions.type, "income"),
        ),
      );

    if (!tx) return null;

    const lineRows = await this.db
      .select({
        potId: pots.id,
        potName: pots.name,
        amount: potAllocations.amount,
        archivedAt: pots.archivedAt,
      })
      .from(potAllocations)
      .innerJoin(pots, eq(pots.id, potAllocations.potId))
      .where(eq(potAllocations.transactionId, id));

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

    const lines = lineRows.map((row): IncomeCancelPreviewLine => {
      if (row.archivedAt !== null) {
        return {
          potId: row.potId,
          potName: row.potName,
          amount: row.amount,
          resultingBalance: null,
          status: "pot_archived",
          shortfall: row.amount,
        };
      }
      const balance = balanceByPot.get(row.potId) ?? 0;
      const resultingBalance = balance - row.amount;
      return {
        potId: row.potId,
        potName: row.potName,
        amount: row.amount,
        resultingBalance,
        status: resultingBalance < 0 ? "shortfall" : "ok",
        shortfall: Math.max(0, -resultingBalance),
      };
    });

    return {
      name: tx.name,
      lines,
      blocked: lines.some((line) => line.status !== "ok"),
    };
  }
}
