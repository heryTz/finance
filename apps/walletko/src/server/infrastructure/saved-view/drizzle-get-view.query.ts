import { and, eq } from "drizzle-orm";
import type { DrizzleDb } from "src/server/infrastructure/db/client";
import { savedViews } from "src/server/infrastructure/db/schema";

export type SavedViewDetail = {
  id: string;
  name: string;
  description: string | null;
  nameFilter: string | null;
  tagIds: string[];
  createdAt: Date;
};

export class DrizzleGetViewQuery {
  constructor(private readonly db: DrizzleDb) {}

  async execute(id: string, userId: string): Promise<SavedViewDetail | null> {
    const [row] = await this.db
      .select()
      .from(savedViews)
      .where(and(eq(savedViews.id, id), eq(savedViews.userId, userId)));
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      description: row.description ?? null,
      nameFilter: row.nameFilter ?? null,
      tagIds: row.tagIds,
      createdAt: row.createdAt,
    };
  }
}
