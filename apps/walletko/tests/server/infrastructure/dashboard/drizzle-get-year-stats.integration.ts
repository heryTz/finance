import { createId } from "@paralleldrive/cuid2";
import { createTestDb, type TestDb } from "tests/integration/helpers/db";
import { truncateAll } from "tests/integration/helpers/truncate";
import {
  insertExpenseAllocation,
  insertPot,
  insertPotAllocation,
  insertTransaction,
} from "tests/integration/helpers/fixtures";
import { DrizzleGetYearStatsQuery } from "src/server/infrastructure/dashboard/drizzle-get-year-stats.query";

describe("DrizzleGetYearStatsQuery", () => {
  let db: TestDb;
  let cleanup: () => Promise<void>;
  let query: DrizzleGetYearStatsQuery;

  beforeAll(async () => {
    ({ db, cleanup } = await createTestDb(`test_year_stats_${createId()}`));
    query = new DrizzleGetYearStatsQuery(db);
  });

  afterAll(async () => {
    await cleanup();
  });

  beforeEach(async () => {
    await truncateAll(db);
  });

  describe("months shape", () => {
    it("always returns exactly 12 month entries", async () => {
      const userId = createId();
      const result = await query.execute(userId, 2026);
      expect(result.months).toHaveLength(12);
      expect(result.months.map((m) => m.month)).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
      ]);
    });

    it("returns 0 income, expense, and flat cumulative for months with no transactions", async () => {
      const userId = createId();
      const result = await query.execute(userId, 2026);
      for (const m of result.months) {
        expect(m.income).toBe(0);
        expect(m.expense).toBe(0);
        expect(m.cumulativeNet).toBe(0);
      }
    });
  });

  describe("monthly income and expense", () => {
    it("sums income allocations per month for the selected year", async () => {
      const userId = createId();
      const pot = await insertPot(db, { userId });

      const janTx = await insertTransaction(db, {
        userId,
        overrides: { createdAt: new Date("2026-01-15") },
      });
      const marTx = await insertTransaction(db, {
        userId,
        overrides: { createdAt: new Date("2026-03-10") },
      });
      await insertPotAllocation(db, {
        transactionId: janTx.id,
        potId: pot.id,
        amount: 1000,
      });
      await insertPotAllocation(db, {
        transactionId: marTx.id,
        potId: pot.id,
        amount: 500,
      });

      const result = await query.execute(userId, 2026);

      expect(result.months[0].income).toBe(1000); // January
      expect(result.months[1].income).toBe(0); // February
      expect(result.months[2].income).toBe(500); // March
    });

    it("sums expense allocations per month for the selected year", async () => {
      const userId = createId();
      const pot = await insertPot(db, { userId });

      const febTx = await insertTransaction(db, {
        userId,
        overrides: { type: "expense", createdAt: new Date("2026-02-20") },
      });
      await insertExpenseAllocation(db, {
        transactionId: febTx.id,
        potId: pot.id,
        amount: 300,
      });

      const result = await query.execute(userId, 2026);

      expect(result.months[1].expense).toBe(300); // February
    });

    it("excludes transactions from a different year", async () => {
      const userId = createId();
      const pot = await insertPot(db, { userId });
      const tx2025 = await insertTransaction(db, {
        userId,
        overrides: { createdAt: new Date("2025-06-01") },
      });
      await insertPotAllocation(db, {
        transactionId: tx2025.id,
        potId: pot.id,
        amount: 9999,
      });

      const result = await query.execute(userId, 2026);

      for (const m of result.months) {
        expect(m.income).toBe(0);
      }
    });
  });

  describe("cumulative net", () => {
    it("accumulates net month by month within the year (no prior data)", async () => {
      const userId = createId();
      const pot = await insertPot(db, { userId });

      // January: income 1000 → net +1000, cumul = 1000
      const janIncome = await insertTransaction(db, {
        userId,
        overrides: { createdAt: new Date("2026-01-10") },
      });
      await insertPotAllocation(db, {
        transactionId: janIncome.id,
        potId: pot.id,
        amount: 1000,
      });

      // February: expense 200 → net -200, cumul = 800
      const febExpense = await insertTransaction(db, {
        userId,
        overrides: { type: "expense", createdAt: new Date("2026-02-05") },
      });
      await insertExpenseAllocation(db, {
        transactionId: febExpense.id,
        potId: pot.id,
        amount: 200,
      });

      // March: income 500 → net +500, cumul = 1300
      const marIncome = await insertTransaction(db, {
        userId,
        overrides: { createdAt: new Date("2026-03-20") },
      });
      await insertPotAllocation(db, {
        transactionId: marIncome.id,
        potId: pot.id,
        amount: 500,
      });

      const result = await query.execute(userId, 2026);

      expect(result.months[0].cumulativeNet).toBe(1000); // Jan
      expect(result.months[1].cumulativeNet).toBe(800); // Feb
      expect(result.months[2].cumulativeNet).toBe(1300); // Mar
    });

    it("empty months keep the previous month's cumulative value", async () => {
      const userId = createId();
      const pot = await insertPot(db, { userId });

      // January only
      const janTx = await insertTransaction(db, {
        userId,
        overrides: { createdAt: new Date("2026-01-01") },
      });
      await insertPotAllocation(db, {
        transactionId: janTx.id,
        potId: pot.id,
        amount: 600,
      });

      const result = await query.execute(userId, 2026);

      // Feb through Dec should all be 600 (flat, no change)
      for (let i = 1; i < 12; i++) {
        expect(result.months[i].cumulativeNet).toBe(600);
      }
    });

    it("january cumulative starts from prior year net when prior data exists", async () => {
      const userId = createId();
      const pot = await insertPot(db, { userId });

      // 2025: income 500, expense 200 → prior net = 300
      const prior2025Income = await insertTransaction(db, {
        userId,
        overrides: { createdAt: new Date("2025-06-01") },
      });
      await insertPotAllocation(db, {
        transactionId: prior2025Income.id,
        potId: pot.id,
        amount: 500,
      });
      const prior2025Expense = await insertTransaction(db, {
        userId,
        overrides: { type: "expense", createdAt: new Date("2025-09-01") },
      });
      await insertExpenseAllocation(db, {
        transactionId: prior2025Expense.id,
        potId: pot.id,
        amount: 200,
      });

      // 2026 January: income 100 → net +100, cumul = 300 + 100 = 400
      const jan2026Income = await insertTransaction(db, {
        userId,
        overrides: { createdAt: new Date("2026-01-15") },
      });
      await insertPotAllocation(db, {
        transactionId: jan2026Income.id,
        potId: pot.id,
        amount: 100,
      });

      const result = await query.execute(userId, 2026);

      expect(result.months[0].cumulativeNet).toBe(400); // Jan 2026
    });

    it("prior net includes all years before the selected year", async () => {
      const userId = createId();
      const pot = await insertPot(db, { userId });

      // 2024: income 1000
      const tx2024 = await insertTransaction(db, {
        userId,
        overrides: { createdAt: new Date("2024-03-01") },
      });
      await insertPotAllocation(db, {
        transactionId: tx2024.id,
        potId: pot.id,
        amount: 1000,
      });

      // 2025: income 500
      const tx2025 = await insertTransaction(db, {
        userId,
        overrides: { createdAt: new Date("2025-07-01") },
      });
      await insertPotAllocation(db, {
        transactionId: tx2025.id,
        potId: pot.id,
        amount: 500,
      });

      // prior net = 1500, 2026 January has no transactions → cumul stays at 1500
      const result = await query.execute(userId, 2026);

      expect(result.months[0].cumulativeNet).toBe(1500);
    });
  });

  describe("user isolation", () => {
    it("does not include another user's transactions in monthly stats", async () => {
      const userA = createId();
      const userB = createId();
      const potA = await insertPot(db, { userId: userA });
      await insertPot(db, { userId: userB });
      const tx = await insertTransaction(db, {
        userId: userA,
        overrides: { createdAt: new Date("2026-05-01") },
      });
      await insertPotAllocation(db, {
        transactionId: tx.id,
        potId: potA.id,
        amount: 9999,
      });

      const result = await query.execute(userB, 2026);

      for (const m of result.months) {
        expect(m.income).toBe(0);
        expect(m.cumulativeNet).toBe(0);
      }
    });

    it("does not include another user's prior transactions in cumulative", async () => {
      const userA = createId();
      const userB = createId();
      const potA = await insertPot(db, { userId: userA });
      await insertPot(db, { userId: userB });
      const prior = await insertTransaction(db, {
        userId: userA,
        overrides: { createdAt: new Date("2025-01-01") },
      });
      await insertPotAllocation(db, {
        transactionId: prior.id,
        potId: potA.id,
        amount: 5000,
      });

      const result = await query.execute(userB, 2026);

      expect(result.months[0].cumulativeNet).toBe(0);
    });
  });

  describe("availableYears", () => {
    it("returns years that have at least one transaction", async () => {
      const userId = createId();
      await insertTransaction(db, {
        userId,
        overrides: { createdAt: new Date("2024-06-01") },
      });
      await insertTransaction(db, {
        userId,
        overrides: { createdAt: new Date("2026-03-01") },
      });

      const result = await query.execute(userId, 2026);

      expect(result.availableYears).toEqual([2024, 2026]);
    });

    it("does not include years from another user's transactions", async () => {
      const userA = createId();
      const userB = createId();
      await insertTransaction(db, {
        userId: userA,
        overrides: { createdAt: new Date("2023-01-01") },
      });
      await insertTransaction(db, {
        userId: userB,
        overrides: { createdAt: new Date("2026-01-01") },
      });

      const result = await query.execute(userB, 2026);

      expect(result.availableYears).toEqual([2026]);
    });

    it("returns years sorted ascending", async () => {
      const userId = createId();
      await insertTransaction(db, {
        userId,
        overrides: { createdAt: new Date("2026-01-01") },
      });
      await insertTransaction(db, {
        userId,
        overrides: { createdAt: new Date("2024-01-01") },
      });
      await insertTransaction(db, {
        userId,
        overrides: { createdAt: new Date("2025-01-01") },
      });

      const result = await query.execute(userId, 2026);

      expect(result.availableYears).toEqual([2024, 2025, 2026]);
    });
  });
});
