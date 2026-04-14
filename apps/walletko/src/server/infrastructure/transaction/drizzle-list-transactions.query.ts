import {
  tags,
  transactionTags,
  transactions,
} from "src/server/infrastructure/db/schema";
import type { DrizzleDb } from "src/server/infrastructure/db/client";
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

    const filters = [eq(transactions.userId, userId)];

    if (type) {
      filters.push(eq(transactions.type, type));
    }

    if (name) {
      filters.push(ilike(transactions.name, `%${name}%`));
    }

    if (tagIds && tagIds.length > 0) {
      const tagSubquery = this.db
        .select({ transactionId: transactionTags.transactionId })
        .from(transactionTags)
        .where(inArray(transactionTags.tagId, tagIds))
        .groupBy(transactionTags.transactionId)
        .having(eq(count(), tagIds.length));

      filters.push(inArray(transactions.id, tagSubquery));
    }

    const where = and(...filters);
    const offset = (page - 1) * pageSize;

    const [rows, [{ total }]] = await Promise.all([
      this.db
        .select({
          id: transactions.id,
          type: transactions.type,
          name: transactions.name,
          amount: transactions.amount,
          createdAt: transactions.createdAt,
        })
        .from(transactions)
        .where(where)
        .orderBy(desc(transactions.createdAt), desc(transactions.id))
        .limit(pageSize)
        .offset(offset),
      this.db.select({ total: count() }).from(transactions).where(where),
    ]);

    const ids = rows.map((r) => r.id);
    const tagRows =
      ids.length > 0
        ? await this.db
            .select({
              transactionId: transactionTags.transactionId,
              tagId: tags.id,
              tagName: tags.name,
            })
            .from(transactionTags)
            .leftJoin(tags, eq(transactionTags.tagId, tags.id))
            .where(inArray(transactionTags.transactionId, ids))
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
