import { asc, eq } from "drizzle-orm";
import type { SavedViewListItem } from "src/server/contracts/saved-view";
import type { DrizzleDb } from "src/server/infrastructure/db/client";
import { savedViews } from "src/server/infrastructure/db/schema";
export type { SavedViewListItem };

export class DrizzleListViewsQuery {
  constructor(private readonly db: DrizzleDb) {}

  async execute(userId: string): Promise<SavedViewListItem[]> {
    const rows = await this.db
      .select()
      .from(savedViews)
      .where(eq(savedViews.userId, userId))
      .orderBy(asc(savedViews.name));
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description ?? null,
      nameFilter: row.nameFilter ?? null,
      tagIds: row.tagIds,
      createdAt: row.createdAt,
    }));
  }
}
