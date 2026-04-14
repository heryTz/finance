import { sql } from "drizzle-orm";
import type { TestDb } from "./db";

export async function truncateAll(db: TestDb): Promise<void> {
  await db.execute(
    sql`TRUNCATE tags, pots, transactions, pot_allocations, expense_allocations, transaction_tags CASCADE`,
  );
}
