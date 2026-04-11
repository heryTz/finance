import {
  tagsV2,
  transactionTagsV2,
  transactionsV2,
} from "@/server/infrastructure/db/schema";
import type { DrizzleDb } from "@/server/infrastructure/db/client";
import { and, count, desc, eq, ilike, inArray } from "drizzle-orm";

export type ListTransactionsParams = {
  page: number;
  pageSize: number;
  name?: string;
  tagIds?: string[];
  type?: "income" | "expense";
};

export type TransactionDTO = {
  id: string;
  type: "income" | "expense";
  name: string;
  amount: number;
  createdAt: Date;
  tags: { id: string; name: string }[];
};

export type ListTransactionsResult = {
  results: TransactionDTO[];
  total: number;
};

export class DrizzleListTransactionsQuery {
  constructor(private readonly db: DrizzleDb) {}

  async execute(
    userId: string,
    params: ListTransactionsParams,
  ): Promise<ListTransactionsResult> {
    const { page, pageSize, name, tagIds, type } = params;

    const filters = [eq(transactionsV2.userId, userId)];

    if (type) {
      filters.push(eq(transactionsV2.type, type));
    }

    if (name) {
      filters.push(ilike(transactionsV2.name, `%${name}%`));
    }

    if (tagIds && tagIds.length > 0) {
      const tagSubquery = this.db
        .select({ transactionId: transactionTagsV2.transactionId })
        .from(transactionTagsV2)
        .where(inArray(transactionTagsV2.tagId, tagIds))
        .groupBy(transactionTagsV2.transactionId)
        .having(eq(count(), tagIds.length));

      filters.push(inArray(transactionsV2.id, tagSubquery));
    }

    const where = and(...filters);
    const offset = (page - 1) * pageSize;

    const [rows, [{ total }]] = await Promise.all([
      this.db
        .select({
          id: transactionsV2.id,
          type: transactionsV2.type,
          name: transactionsV2.name,
          amount: transactionsV2.amount,
          createdAt: transactionsV2.createdAt,
        })
        .from(transactionsV2)
        .where(where)
        .orderBy(desc(transactionsV2.createdAt), desc(transactionsV2.id))
        .limit(pageSize)
        .offset(offset),
      this.db.select({ total: count() }).from(transactionsV2).where(where),
    ]);

    const ids = rows.map((r) => r.id);
    const tagRows =
      ids.length > 0
        ? await this.db
            .select({
              transactionId: transactionTagsV2.transactionId,
              tagId: tagsV2.id,
              tagName: tagsV2.name,
            })
            .from(transactionTagsV2)
            .leftJoin(tagsV2, eq(transactionTagsV2.tagId, tagsV2.id))
            .where(inArray(transactionTagsV2.transactionId, ids))
        : [];

    const tagsByTx = new Map<string, { id: string; name: string }[]>();
    for (const row of tagRows) {
      if (!row.tagId || !row.tagName) continue;
      if (!tagsByTx.has(row.transactionId)) {
        tagsByTx.set(row.transactionId, []);
      }
      tagsByTx
        .get(row.transactionId)!
        .push({ id: row.tagId, name: row.tagName });
    }

    return {
      results: rows.map((row) => ({
        id: row.id,
        type: row.type,
        name: row.name,
        amount: row.amount,
        createdAt: row.createdAt,
        tags: tagsByTx.get(row.id) ?? [],
      })),
      total,
    };
  }
}
