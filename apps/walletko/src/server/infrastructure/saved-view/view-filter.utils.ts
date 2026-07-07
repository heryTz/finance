import type { SQL } from "drizzle-orm";
import { count, eq, ilike, inArray } from "drizzle-orm";
import type { DrizzleDb } from "src/server/infrastructure/db/client";
import {
  transactions,
  transactionTags,
} from "src/server/infrastructure/db/schema";

export type ViewFilter = { nameFilter: string | null; tagIds: string[] };

export function buildViewFilters(
  db: DrizzleDb,
  userId: string,
  filter: ViewFilter,
): SQL[] {
  const filters: SQL[] = [eq(transactions.userId, userId)];

  if (filter.nameFilter) {
    filters.push(ilike(transactions.name, `%${filter.nameFilter}%`));
  }

  if (filter.tagIds.length > 0) {
    const tagSubquery = db
      .select({ transactionId: transactionTags.transactionId })
      .from(transactionTags)
      .where(inArray(transactionTags.tagId, filter.tagIds))
      .groupBy(transactionTags.transactionId)
      .having(eq(count(), filter.tagIds.length));
    filters.push(inArray(transactions.id, tagSubquery));
  }

  return filters;
}
