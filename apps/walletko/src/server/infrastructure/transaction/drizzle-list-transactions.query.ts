import { and, count, desc, eq, ilike, inArray, notInArray } from "drizzle-orm";
import type { DrizzleDb } from "src/server/infrastructure/db/client";
import {
  tags,
  transactions,
  transactionTags,
} from "src/server/infrastructure/db/schema";

export type ListTransactionsParams = {
  page: number;
  pageSize: number;
  name?: string;
  tagIds?: string[];
  types?: string[];
};

import type { TransactionDTO } from "src/server/contracts/transaction";
export type { TransactionDTO };

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
    const { page, pageSize, name, tagIds, types } = params;

    const filters = [eq(transactions.userId, userId)];

    type TransactionTypeValue =
      | "income"
      | "expense"
      | "transfer"
      | "canceled_income"
      | "income_cancellation"
      | "canceled_expense"
      | "expense_cancellation";
    const EXPAND: Record<string, TransactionTypeValue[]> = {
      canceled_income: ["canceled_income", "canceled_expense"],
      income_cancellation: ["income_cancellation", "expense_cancellation"],
    };
    const ALL_CANCELLED_TYPES: TransactionTypeValue[] = [
      "canceled_income",
      "canceled_expense",
      "income_cancellation",
      "expense_cancellation",
    ];
    const effectiveTypes = (types ?? []).flatMap(
      (t): TransactionTypeValue[] => EXPAND[t] ?? [t as TransactionTypeValue],
    );
    if (effectiveTypes.length > 0) {
      filters.push(inArray(transactions.type, effectiveTypes));
    }
    const hidden = ALL_CANCELLED_TYPES.filter(
      (t) => !effectiveTypes.includes(t),
    );
    if (hidden.length > 0) {
      filters.push(notInArray(transactions.type, hidden));
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
            .innerJoin(
              tags,
              and(eq(transactionTags.tagId, tags.id), eq(tags.userId, userId)),
            )
            .where(inArray(transactionTags.transactionId, ids))
        : [];

    const tagsByTx = new Map<string, { id: string; name: string }[]>();
    for (const row of tagRows) {
      if (!row.tagId || !row.tagName) continue;
      if (!tagsByTx.has(row.transactionId)) {
        tagsByTx.set(row.transactionId, []);
      }
      tagsByTx
        .get(row.transactionId)
        ?.push({ id: row.tagId, name: row.tagName });
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
