import { and, eq, inArray, isNull, sql, sum } from "drizzle-orm";
import type { DrizzleDb } from "src/server/infrastructure/db/client";
import {
  expenseAllocations,
  potAllocations,
  pots,
} from "src/server/infrastructure/db/schema";

export class DrizzleGetTotalBalanceQuery {
  constructor(private readonly db: DrizzleDb) {}

  async execute(userId: string): Promise<number> {
    const userPotIds = this.db
      .select({ id: pots.id })
      .from(pots)
      .where(and(eq(pots.userId, userId), isNull(pots.archivedAt)));

    const [[income], [expense]] = await Promise.all([
      this.db
        .select({
          total:
            sql<number>`COALESCE(${sum(potAllocations.amount)}, 0)`.mapWith(
              Number,
            ),
        })
        .from(potAllocations)
        .where(inArray(potAllocations.potId, userPotIds)),
      this.db
        .select({
          total:
            sql<number>`COALESCE(${sum(expenseAllocations.amount)}, 0)`.mapWith(
              Number,
            ),
        })
        .from(expenseAllocations)
        .where(inArray(expenseAllocations.potId, userPotIds)),
    ]);

    return (income?.total ?? 0) - (expense?.total ?? 0);
  }
}
