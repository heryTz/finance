import { sql } from "drizzle-orm";
import { TestDb } from "./db";

export async function truncateAll(db: TestDb): Promise<void> {
  await db.execute(
    sql`TRUNCATE tags_v2, pots_v2, transactions_v2, pot_allocations_v2, expense_allocations_v2, transaction_tags_v2 CASCADE`,
  );
}
