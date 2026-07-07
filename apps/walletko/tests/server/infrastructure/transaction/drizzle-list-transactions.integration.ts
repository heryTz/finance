import { createId } from "@paralleldrive/cuid2";
import { createTestDb, type TestDb } from "tests/integration/helpers/db";
import { truncateAll } from "tests/integration/helpers/truncate";
import {
  insertTag,
  insertTransaction,
  insertTransactionTag,
} from "tests/integration/helpers/fixtures";
import { DrizzleListTransactionsQuery } from "src/server/infrastructure/transaction/drizzle-list-transactions.query";

const defaultParams = { page: 1, pageSize: 20 };

describe("DrizzleListTransactionsQuery", () => {
  let db: TestDb;
  let cleanup: () => Promise<void>;
  let query: DrizzleListTransactionsQuery;

  beforeAll(async () => {
    ({ db, cleanup } = await createTestDb(`test_transactions_${createId()}`));
    query = new DrizzleListTransactionsQuery(db);
  });

  afterAll(async () => {
    await cleanup();
  });

  beforeEach(async () => {
    await truncateAll(db);
  });

  describe("userId isolation", () => {
    it("returns only transactions belonging to the requesting user", async () => {
      const userA = createId();
      const userB = createId();
      await insertTransaction(db, { userId: userA });
      await insertTransaction(db, { userId: userA });
      await insertTransaction(db, { userId: userB });

      const { results, total } = await query.execute(userA, defaultParams);

      expect(results).toHaveLength(2);
      expect(total).toBe(2);
    });
  });

  describe("pagination", () => {
    it("returns the correct page and total count", async () => {
      const userId = createId();
      for (let i = 0; i < 5; i++) {
        await insertTransaction(db, { userId });
      }

      const { results, total } = await query.execute(userId, {
        page: 2,
        pageSize: 2,
      });

      expect(results).toHaveLength(2);
      expect(total).toBe(5);
    });
  });

  describe("filters", () => {
    it("filters by type — income only", async () => {
      const userId = createId();
      await insertTransaction(db, { userId, overrides: { type: "income" } });
      await insertTransaction(db, { userId, overrides: { type: "expense" } });

      const { results, total } = await query.execute(userId, {
        ...defaultParams,
        types: ["income"],
      });

      expect(results).toHaveLength(1);
      expect(total).toBe(1);
      expect(results[0].type).toBe("income");
    });

    it("filters by type — expense only", async () => {
      const userId = createId();
      await insertTransaction(db, { userId, overrides: { type: "income" } });
      await insertTransaction(db, { userId, overrides: { type: "expense" } });

      const { results, total } = await query.execute(userId, {
        ...defaultParams,
        types: ["expense"],
      });

      expect(results).toHaveLength(1);
      expect(total).toBe(1);
      expect(results[0].type).toBe("expense");
    });

    it("filters by name — case-insensitive partial match", async () => {
      const userId = createId();
      await insertTransaction(db, {
        userId,
        overrides: { name: "Salary Payment" },
      });
      await insertTransaction(db, {
        userId,
        overrides: { name: "Grocery Store" },
      });

      const { results } = await query.execute(userId, {
        ...defaultParams,
        name: "salary",
      });

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("Salary Payment");
    });

    it("filters by a single tagId", async () => {
      const userId = createId();
      const tag = await insertTag(db, { userId });
      const tagged = await insertTransaction(db, { userId });
      await insertTransaction(db, { userId });
      await insertTransactionTag(db, {
        transactionId: tagged.id,
        tagId: tag.id,
      });

      const { results, total } = await query.execute(userId, {
        ...defaultParams,
        tagIds: [tag.id],
      });

      expect(total).toBe(1);
      expect(results[0].id).toBe(tagged.id);
    });

    it("filters by multiple tagIds — AND logic returns only transactions with all tags", async () => {
      const userId = createId();
      const tagA = await insertTag(db, { userId });
      const tagB = await insertTag(db, { userId });

      const bothTags = await insertTransaction(db, { userId });
      const onlyA = await insertTransaction(db, { userId });
      await insertTransactionTag(db, {
        transactionId: bothTags.id,
        tagId: tagA.id,
      });
      await insertTransactionTag(db, {
        transactionId: bothTags.id,
        tagId: tagB.id,
      });
      await insertTransactionTag(db, {
        transactionId: onlyA.id,
        tagId: tagA.id,
      });

      const { results, total } = await query.execute(userId, {
        ...defaultParams,
        tagIds: [tagA.id, tagB.id],
      });

      expect(total).toBe(1);
      expect(results[0].id).toBe(bothTags.id);
    });
  });

  describe("tag assembly", () => {
    it("attaches tags to matching transactions", async () => {
      const userId = createId();
      const tag = await insertTag(db, { userId, overrides: { name: "food" } });
      const tx = await insertTransaction(db, { userId });
      await insertTransactionTag(db, { transactionId: tx.id, tagId: tag.id });

      const { results } = await query.execute(userId, defaultParams);

      expect(results[0].tags).toHaveLength(1);
      expect(results[0].tags[0]).toEqual({ id: tag.id, name: "food" });
    });

    it("returns an empty tags array for transactions with no tags", async () => {
      const userId = createId();
      await insertTransaction(db, { userId });

      const { results } = await query.execute(userId, defaultParams);

      expect(results[0].tags).toEqual([]);
    });
  });

  describe("ordering", () => {
    it("returns transactions newest first", async () => {
      const userId = createId();
      const older = await insertTransaction(db, {
        userId,
        overrides: { createdAt: new Date("2024-01-01") },
      });
      const newer = await insertTransaction(db, {
        userId,
        overrides: { createdAt: new Date("2024-06-01") },
      });

      const { results } = await query.execute(userId, defaultParams);

      expect(results[0].id).toBe(newer.id);
      expect(results[1].id).toBe(older.id);
    });
  });
});
