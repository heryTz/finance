import { createId } from "@paralleldrive/cuid2";
import { createTestDb, type TestDb } from "tests/integration/helpers/db";
import { truncateAll } from "tests/integration/helpers/truncate";
import {
  insertExpenseAllocation,
  insertPot,
  insertPotAllocation,
  insertTransaction,
} from "tests/integration/helpers/fixtures";
import { DrizzleGetOverviewStatsQuery } from "src/server/infrastructure/dashboard/drizzle-get-overview-stats.query";

describe("DrizzleGetOverviewStatsQuery", () => {
  let db: TestDb;
  let cleanup: () => Promise<void>;
  let query: DrizzleGetOverviewStatsQuery;

  beforeAll(async () => {
    ({ db, cleanup } = await createTestDb(`test_overview_${createId()}`));
    query = new DrizzleGetOverviewStatsQuery(db);
  });

  afterAll(async () => {
    await cleanup();
  });

  beforeEach(async () => {
    await truncateAll(db);
  });

  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 15);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);

  describe("totalBalance", () => {
    it("returns 0 when user has no pots", async () => {
      const userId = createId();
      const result = await query.execute(userId);
      expect(result.totalBalance).toBe(0);
    });

    it("returns sum of income allocations minus expense allocations across all pots", async () => {
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
        amount: 1000,
      });
      await insertExpenseAllocation(db, {
        transactionId: expenseTx.id,
        potId: pot.id,
        amount: 300,
      });

      const result = await query.execute(userId);

      expect(result.totalBalance).toBe(700);
    });

    it("does not include another user's pot balances", async () => {
      const userA = createId();
      const userB = createId();
      const potA = await insertPot(db, { userId: userA });
      const tx = await insertTransaction(db, { userId: userA });
      await insertPotAllocation(db, {
        transactionId: tx.id,
        potId: potA.id,
        amount: 5000,
      });

      const result = await query.execute(userB);

      expect(result.totalBalance).toBe(0);
    });

    it("returns 0 for a pot with no allocations", async () => {
      const userId = createId();
      await insertPot(db, { userId });

      const result = await query.execute(userId);

      expect(result.totalBalance).toBe(0);
    });

    it("excludes allocations from archived pots", async () => {
      const userId = createId();
      const deletedPot = await insertPot(db, {
        userId,
        overrides: { archivedAt: new Date() },
      });
      const tx = await insertTransaction(db, { userId });
      await insertPotAllocation(db, {
        transactionId: tx.id,
        potId: deletedPot.id,
        amount: 5000,
      });

      const result = await query.execute(userId);

      expect(result.totalBalance).toBe(0);
    });
  });

  describe("monthIncome", () => {
    it("returns 0 when user has no transactions this month", async () => {
      const userId = createId();
      await insertPot(db, { userId });
      const result = await query.execute(userId);
      expect(result.monthIncome).toBe(0);
    });

    it("sums pot allocations for transactions in the current month", async () => {
      const userId = createId();
      const pot = await insertPot(db, { userId });
      const tx = await insertTransaction(db, {
        userId,
        overrides: { createdAt: thisMonth },
      });
      await insertPotAllocation(db, {
        transactionId: tx.id,
        potId: pot.id,
        amount: 800,
      });

      const result = await query.execute(userId);

      expect(result.monthIncome).toBe(800);
    });

    it("excludes income transactions from previous months", async () => {
      const userId = createId();
      const pot = await insertPot(db, { userId });
      const oldTx = await insertTransaction(db, {
        userId,
        overrides: { createdAt: lastMonth },
      });
      await insertPotAllocation(db, {
        transactionId: oldTx.id,
        potId: pot.id,
        amount: 9999,
      });

      const result = await query.execute(userId);

      expect(result.monthIncome).toBe(0);
    });

    it("does not include another user's income", async () => {
      const userA = createId();
      const userB = createId();
      const potA = await insertPot(db, { userId: userA });
      await insertPot(db, { userId: userB });
      const tx = await insertTransaction(db, {
        userId: userA,
        overrides: { createdAt: thisMonth },
      });
      await insertPotAllocation(db, {
        transactionId: tx.id,
        potId: potA.id,
        amount: 4000,
      });

      const result = await query.execute(userB);

      expect(result.monthIncome).toBe(0);
    });
  });

  describe("monthExpense", () => {
    it("sums expense allocations for transactions in the current month", async () => {
      const userId = createId();
      const pot = await insertPot(db, { userId });
      const tx = await insertTransaction(db, {
        userId,
        overrides: { type: "expense", createdAt: thisMonth },
      });
      await insertExpenseAllocation(db, {
        transactionId: tx.id,
        potId: pot.id,
        amount: 250,
      });

      const result = await query.execute(userId);

      expect(result.monthExpense).toBe(250);
    });

    it("excludes expense transactions from previous months", async () => {
      const userId = createId();
      const pot = await insertPot(db, { userId });
      const oldTx = await insertTransaction(db, {
        userId,
        overrides: { type: "expense", createdAt: lastMonth },
      });
      await insertExpenseAllocation(db, {
        transactionId: oldTx.id,
        potId: pot.id,
        amount: 9999,
      });

      const result = await query.execute(userId);

      expect(result.monthExpense).toBe(0);
    });

    it("does not include another user's expenses", async () => {
      const userA = createId();
      const userB = createId();
      const potA = await insertPot(db, { userId: userA });
      await insertPot(db, { userId: userB });
      const tx = await insertTransaction(db, {
        userId: userA,
        overrides: { type: "expense", createdAt: thisMonth },
      });
      await insertExpenseAllocation(db, {
        transactionId: tx.id,
        potId: potA.id,
        amount: 7500,
      });

      const result = await query.execute(userB);

      expect(result.monthExpense).toBe(0);
    });
  });
});
