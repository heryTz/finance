import { asc, count, eq } from "drizzle-orm";
import type { DrizzleDb } from "src/server/infrastructure/db/client";
import { tags, transactionTags } from "src/server/infrastructure/db/schema";

export type TagListItem = { id: string; name: string; count: number };
export type TagListResult = {
  items: TagListItem[];
  total: number;
  page: number;
  pageSize: number;
};

export class DrizzleListTagsQuery {
  constructor(private readonly db: DrizzleDb) {}

  async execute(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<TagListResult> {
    const offset = (page - 1) * pageSize;

    const [items, [totalRow]] = await Promise.all([
      this.db
        .select({
          id: tags.id,
          name: tags.name,
          count: count(transactionTags.transactionId),
        })
        .from(tags)
        .leftJoin(transactionTags, eq(tags.id, transactionTags.tagId))
        .where(eq(tags.userId, userId))
        .groupBy(tags.id, tags.name)
        .orderBy(asc(tags.name))
        .limit(pageSize)
        .offset(offset),
      this.db
        .select({ total: count() })
        .from(tags)
        .where(eq(tags.userId, userId)),
    ]);

    return {
      items: items.map((row) => ({
        id: row.id,
        name: row.name,
        count: Number(row.count),
      })),
      total: Number(totalRow?.total ?? 0),
      page,
      pageSize,
    };
  }
}
