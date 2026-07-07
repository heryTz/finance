import { createId } from "@paralleldrive/cuid2";
import { createTestDb, type TestDb } from "tests/integration/helpers/db";
import { truncateAll } from "tests/integration/helpers/truncate";
import {
  insertExpenseAllocation,
  insertPot,
  insertPotAllocation,
  insertTransaction,
} from "tests/integration/helpers/fixtures";
import { DrizzleListPotsQuery } from "src/server/infrastructure/pot-collection/drizzle-list-pots.query";

describe("DrizzleListPotsQuery", () => {
  let db: TestDb;
  let cleanup: () => Promise<void>;
  let query: DrizzleListPotsQuery;

  beforeAll(async () => {
    ({ db, cleanup } = await createTestDb(`test_pots_${createId()}`));
    query = new DrizzleListPotsQuery(db);
  });

  afterAll(async () => {
    await cleanup();
  });

  beforeEach(async () => {
    await truncateAll(db);
  });

  describe("balance calculation", () => {
    it("returns 0 balance for a pot with no allocations", async () => {
      const userId = createId();
      await insertPot(db, { userId });

      const results = await query.execute(userId);

      expect(results).toHaveLength(1);
      expect(results[0].balance).toBe(0);
    });

    it("returns sum of pot allocations when there are only income allocations", async () => {
      const userId = createId();
      const pot = await insertPot(db, { userId });
      const tx1 = await insertTransaction(db, { userId });
      const tx2 = await insertTransaction(db, { userId });
      await insertPotAllocation(db, {
        transactionId: tx1.id,
        potId: pot.id,
        amount: 1000,
      });
      await insertPotAllocation(db, {
        transactionId: tx2.id,
        potId: pot.id,
        amount: 500,
      });

      const results = await query.execute(userId);

      expect(results[0].balance).toBe(1500);
    });

    it("returns negative balance when there are only expense allocations", async () => {
      const userId = createId();
      const pot = await insertPot(db, { userId });
      const tx = await insertTransaction(db, {
        userId,
        overrides: { type: "expense" },
      });
      await insertExpenseAllocation(db, {
        transactionId: tx.id,
        potId: pot.id,
        amount: 300,
      });

      const results = await query.execute(userId);

      expect(results[0].balance).toBe(-300);
    });

    it("returns income minus expense when both exist", async () => {
      const userId = createId();
      const pot = await insertPot(db, { userId });
      const incomeTx = await insertTransaction(db, { userId });
      const expenseTx = await insertTransaction(db, {
        userId,
        overrides: { type: "expense" },
      });
      await insertPotAllocation(db, {
        transactionId: incomeTx.id,
        potId: pot.id,
        amount: 2000,
      });
      await insertExpenseAllocation(db, {
        transactionId: expenseTx.id,
        potId: pot.id,
        amount: 800,
      });

      const results = await query.execute(userId);

      expect(results[0].balance).toBe(1200);
    });

    it("calculates independent balances for multiple pots", async () => {
      const userId = createId();
      const potA = await insertPot(db, { userId });
      const potB = await insertPot(db, { userId });
      const tx = await insertTransaction(db, { userId });
      await insertPotAllocation(db, {
        transactionId: tx.id,
        potId: potA.id,
        amount: 400,
      });
      await insertPotAllocation(db, {
        transactionId: tx.id,
        potId: potB.id,
        amount: 900,
      });

      const results = await query.execute(userId);
      const balanceById = Object.fromEntries(
        results.map((r) => [r.id, r.balance]),
      );

      expect(balanceById[potA.id]).toBe(400);
      expect(balanceById[potB.id]).toBe(900);
    });
  });

  describe("archive filtering", () => {
    it("does not return an archived pot", async () => {
      const userId = createId();
      await insertPot(db, { userId, overrides: { archivedAt: new Date() } });

      const results = await query.execute(userId);

      expect(results).toHaveLength(0);
    });

    it("returns active pots while excluding archived ones", async () => {
      const userId = createId();
      const activePot = await insertPot(db, { userId });
      await insertPot(db, { userId, overrides: { archivedAt: new Date() } });

      const results = await query.execute(userId);

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(activePot.id);
    });
  });

  describe("userId isolation", () => {
    it("does not return pots belonging to another user", async () => {
      const userA = createId();
      const userB = createId();
      await insertPot(db, { userId: userA });

      const results = await query.execute(userB);

      expect(results).toHaveLength(0);
    });

    it("does not include another user's allocations in balance", async () => {
      const userA = createId();
      const userB = createId();
      const potA = await insertPot(db, { userId: userA });
      await insertPot(db, { userId: userB });

      const tx = await insertTransaction(db, { userId: userA });
      await insertPotAllocation(db, {
        transactionId: tx.id,
        potId: potA.id,
        amount: 99999,
      });

      const results = await query.execute(userB);

      expect(results).toHaveLength(1);
      expect(results[0].balance).toBe(0);
    });
  });
});
