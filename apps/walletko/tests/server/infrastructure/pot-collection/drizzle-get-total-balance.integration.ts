import { createId } from "@paralleldrive/cuid2";
import { createTestDb, type TestDb } from "tests/integration/helpers/db";
import { truncateAll } from "tests/integration/helpers/truncate";
import {
  insertExpenseAllocation,
  insertPot,
  insertPotAllocation,
  insertTransaction,
} from "tests/integration/helpers/fixtures";
import { DrizzleGetTotalBalanceQuery } from "src/server/infrastructure/pot-collection/drizzle-get-total-balance.query";

describe("DrizzleGetTotalBalanceQuery", () => {
  let db: TestDb;
  let cleanup: () => Promise<void>;
  let query: DrizzleGetTotalBalanceQuery;

  beforeAll(async () => {
    ({ db, cleanup } = await createTestDb(`test_total_balance_${createId()}`));
    query = new DrizzleGetTotalBalanceQuery(db);
  });

  afterAll(async () => {
    await cleanup();
  });

  beforeEach(async () => {
    await truncateAll(db);
  });

  describe("balance calculation", () => {
    it("returns 0 when the user has no pots", async () => {
      const userId = createId();

      const result = await query.execute(userId);

      expect(result).toBe(0);
    });

    it("returns 0 when the user has pots but no allocations", async () => {
      const userId = createId();
      await insertPot(db, { userId });
      await insertPot(db, { userId });

      const result = await query.execute(userId);

      expect(result).toBe(0);
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

      const result = await query.execute(userId);

      expect(result).toBe(1500);
    });

    it("returns negative total when there are only expense allocations", async () => {
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

      const result = await query.execute(userId);

      expect(result).toBe(-300);
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

      const result = await query.execute(userId);

      expect(result).toBe(1200);
    });

    it("sums balances across multiple pots", async () => {
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

      const result = await query.execute(userId);

      expect(result).toBe(1300);
    });
  });

  describe("archive filtering", () => {
    it("excludes allocations for archived pots", async () => {
      const userId = createId();
      const activePot = await insertPot(db, { userId });
      const deletedPot = await insertPot(db, {
        userId,
        overrides: { archivedAt: new Date() },
      });

      const tx = await insertTransaction(db, { userId });
      await insertPotAllocation(db, {
        transactionId: tx.id,
        potId: activePot.id,
        amount: 600,
      });
      await insertPotAllocation(db, {
        transactionId: tx.id,
        potId: deletedPot.id,
        amount: 99999,
      });

      const result = await query.execute(userId);

      expect(result).toBe(600);
    });
  });

  describe("consistency with transaction amounts", () => {
    it("matches the income transaction amount when allocations sum to it", async () => {
      const userId = createId();
      const pot = await insertPot(db, { userId });
      const tx = await insertTransaction(db, {
        userId,
        overrides: { amount: 3000 },
      });
      await insertPotAllocation(db, {
        transactionId: tx.id,
        potId: pot.id,
        amount: tx.amount,
      });

      const result = await query.execute(userId);

      expect(result).toBe(tx.amount);
    });

    it("matches negative transaction amount when expense allocations sum to it", async () => {
      const userId = createId();
      const pot = await insertPot(db, { userId });
      const tx = await insertTransaction(db, {
        userId,
        overrides: { type: "expense", amount: 1500 },
      });
      await insertExpenseAllocation(db, {
        transactionId: tx.id,
        potId: pot.id,
        amount: tx.amount,
      });

      const result = await query.execute(userId);

      expect(result).toBe(-tx.amount);
    });

    it("matches net of income and expense transaction amounts when allocations are complete", async () => {
      const userId = createId();
      const potA = await insertPot(db, { userId });
      const potB = await insertPot(db, { userId });

      const incomeTx = await insertTransaction(db, {
        userId,
        overrides: { amount: 5000 },
      });
      await insertPotAllocation(db, {
        transactionId: incomeTx.id,
        potId: potA.id,
        amount: 3000,
      });
      await insertPotAllocation(db, {
        transactionId: incomeTx.id,
        potId: potB.id,
        amount: 2000,
      });

      const expenseTx = await insertTransaction(db, {
        userId,
        overrides: { type: "expense", amount: 1200 },
      });
      await insertExpenseAllocation(db, {
        transactionId: expenseTx.id,
        potId: potA.id,
        amount: 1200,
      });

      const result = await query.execute(userId);

      expect(result).toBe(incomeTx.amount - expenseTx.amount);
    });

    it("matches net across multiple income and expense transactions", async () => {
      const userId = createId();
      const pot = await insertPot(db, { userId });

      const incomeTxs = [
        await insertTransaction(db, { userId, overrides: { amount: 4000 } }),
        await insertTransaction(db, { userId, overrides: { amount: 2500 } }),
      ];
      const expenseTxs = [
        await insertTransaction(db, {
          userId,
          overrides: { type: "expense", amount: 600 },
        }),
        await insertTransaction(db, {
          userId,
          overrides: { type: "expense", amount: 900 },
        }),
      ];

      for (const tx of incomeTxs) {
        await insertPotAllocation(db, {
          transactionId: tx.id,
          potId: pot.id,
          amount: tx.amount,
        });
      }
      for (const tx of expenseTxs) {
        await insertExpenseAllocation(db, {
          transactionId: tx.id,
          potId: pot.id,
          amount: tx.amount,
        });
      }

      const totalIncome = incomeTxs.reduce((s, tx) => s + tx.amount, 0);
      const totalExpense = expenseTxs.reduce((s, tx) => s + tx.amount, 0);

      const result = await query.execute(userId);

      expect(result).toBe(totalIncome - totalExpense);
    });
  });

  describe("userId isolation", () => {
    it("returns 0 for a user with no pots even if other users have pots", async () => {
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

      expect(result).toBe(0);
    });

    it("does not include another user's allocations in the total", async () => {
      const userA = createId();
      const userB = createId();
      const potA = await insertPot(db, { userId: userA });
      const potB = await insertPot(db, { userId: userB });

      const txA = await insertTransaction(db, { userId: userA });
      await insertPotAllocation(db, {
        transactionId: txA.id,
        potId: potA.id,
        amount: 99999,
      });

      const txB = await insertTransaction(db, { userId: userB });
      await insertPotAllocation(db, {
        transactionId: txB.id,
        potId: potB.id,
        amount: 700,
      });

      const result = await query.execute(userB);

      expect(result).toBe(700);
    });
  });
});
