import { createId } from "@paralleldrive/cuid2";
import { createTestDb, type TestDb } from "tests/integration/helpers/db";
import { truncateAll } from "tests/integration/helpers/truncate";
import {
  insertTag,
  insertTransaction,
  insertTransactionTag,
} from "tests/integration/helpers/fixtures";
import { DrizzleListTagsQuery } from "src/server/infrastructure/tag/drizzle-list-tags.query";

describe("DrizzleListTagsQuery", () => {
  let db: TestDb;
  let cleanup: () => Promise<void>;
  let query: DrizzleListTagsQuery;

  beforeAll(async () => {
    ({ db, cleanup } = await createTestDb(`test_tags_${createId()}`));
    query = new DrizzleListTagsQuery(db);
  });

  afterAll(async () => {
    await cleanup();
  });

  beforeEach(async () => {
    await truncateAll(db);
  });

  describe("count", () => {
    it("returns count 0 for a tag with no linked transactions", async () => {
      const userId = createId();
      const tag = await insertTag(db, { userId });

      const result = await query.execute(userId, 1, 20);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe(tag.id);
      expect(result.items[0].count).toBe(0);
    });

    it("returns the correct transaction count for a tag", async () => {
      const userId = createId();
      const tag = await insertTag(db, { userId });
      const tx1 = await insertTransaction(db, { userId });
      const tx2 = await insertTransaction(db, { userId });
      await insertTransactionTag(db, { transactionId: tx1.id, tagId: tag.id });
      await insertTransactionTag(db, { transactionId: tx2.id, tagId: tag.id });

      const result = await query.execute(userId, 1, 20);

      expect(result.items[0].count).toBe(2);
    });

    it("counts independently across multiple tags", async () => {
      const userId = createId();
      const tagA = await insertTag(db, { userId, overrides: { name: "aaa" } });
      const tagB = await insertTag(db, { userId, overrides: { name: "bbb" } });
      const tx = await insertTransaction(db, { userId });
      await insertTransactionTag(db, { transactionId: tx.id, tagId: tagA.id });

      const result = await query.execute(userId, 1, 20);
      const countById = Object.fromEntries(
        result.items.map((t) => [t.id, t.count]),
      );

      expect(countById[tagA.id]).toBe(1);
      expect(countById[tagB.id]).toBe(0);
    });
  });

  describe("ordering", () => {
    it("returns tags ordered by name ascending", async () => {
      const userId = createId();
      await insertTag(db, { userId, overrides: { name: "zebra" } });
      await insertTag(db, { userId, overrides: { name: "apple" } });
      await insertTag(db, { userId, overrides: { name: "mango" } });

      const result = await query.execute(userId, 1, 20);

      expect(result.items.map((t) => t.name)).toEqual([
        "apple",
        "mango",
        "zebra",
      ]);
    });
  });

  describe("pagination", () => {
    it("returns the correct page of results", async () => {
      const userId = createId();
      await insertTag(db, { userId, overrides: { name: "aaa" } });
      await insertTag(db, { userId, overrides: { name: "bbb" } });
      await insertTag(db, { userId, overrides: { name: "ccc" } });

      const result = await query.execute(userId, 2, 2);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe("ccc");
    });

    it("returns total reflecting all tags regardless of page", async () => {
      const userId = createId();
      await insertTag(db, { userId });
      await insertTag(db, { userId });
      await insertTag(db, { userId });

      const result = await query.execute(userId, 1, 2);

      expect(result.total).toBe(3);
      expect(result.items).toHaveLength(2);
    });

    it("returns empty items on a page beyond the last", async () => {
      const userId = createId();
      await insertTag(db, { userId });

      const result = await query.execute(userId, 2, 20);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(1);
    });

    it("echoes page and pageSize in the result", async () => {
      const userId = createId();

      const result = await query.execute(userId, 3, 10);

      expect(result.page).toBe(3);
      expect(result.pageSize).toBe(10);
    });
  });

  describe("userId isolation", () => {
    it("does not return tags belonging to another user", async () => {
      const userA = createId();
      const userB = createId();
      await insertTag(db, { userId: userA });

      const result = await query.execute(userB, 1, 20);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it("does not include another user's transaction count", async () => {
      const userA = createId();
      const userB = createId();
      const tagA = await insertTag(db, { userId: userA });
      const tagB = await insertTag(db, { userId: userB });
      const txA = await insertTransaction(db, { userId: userA });
      await insertTransactionTag(db, { transactionId: txA.id, tagId: tagA.id });

      const resultB = await query.execute(userB, 1, 20);

      expect(resultB.items[0].id).toBe(tagB.id);
      expect(resultB.items[0].count).toBe(0);
    });
  });
});
