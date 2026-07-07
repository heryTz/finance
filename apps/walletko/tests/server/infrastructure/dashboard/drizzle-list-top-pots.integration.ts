import { createId } from "@paralleldrive/cuid2";
import { createTestDb, type TestDb } from "tests/integration/helpers/db";
import { truncateAll } from "tests/integration/helpers/truncate";
import {
  insertExpenseAllocation,
  insertPot,
  insertPotAllocation,
  insertTransaction,
} from "tests/integration/helpers/fixtures";
import { DrizzleListTopPotsQuery } from "src/server/infrastructure/dashboard/drizzle-list-top-pots.query";

describe("DrizzleListTopPotsQuery", () => {
  let db: TestDb;
  let cleanup: () => Promise<void>;
  let query: DrizzleListTopPotsQuery;

  beforeAll(async () => {
    ({ db, cleanup } = await createTestDb(`test_top_pots_${createId()}`));
    query = new DrizzleListTopPotsQuery(db);
  });

  afterAll(async () => {
    await cleanup();
  });

  beforeEach(async () => {
    await truncateAll(db);
  });

  it("default pot is always returned first regardless of percentage", async () => {
    const userId = createId();
    const defaultPot = await insertPot(db, {
      userId,
      overrides: { isDefault: true, percentage: 5 },
    });
    await insertPot(db, { userId, overrides: { percentage: 80 } });
    await insertPot(db, { userId, overrides: { percentage: 60 } });

    const results = await query.execute(userId, 10);

    expect(results[0].id).toBe(defaultPot.id);
  });

  it("non-default pots are ordered by percentage descending", async () => {
    const userId = createId();
    await insertPot(db, {
      userId,
      overrides: { isDefault: true, percentage: 10 },
    });
    const high = await insertPot(db, { userId, overrides: { percentage: 80 } });
    const mid = await insertPot(db, { userId, overrides: { percentage: 50 } });
    const low = await insertPot(db, { userId, overrides: { percentage: 20 } });

    const results = await query.execute(userId, 10);

    expect(results.map((r) => r.id).slice(1)).toEqual([
      high.id,
      mid.id,
      low.id,
    ]);
  });

  it("respects the limit parameter", async () => {
    const userId = createId();
    await insertPot(db, { userId });
    await insertPot(db, { userId });
    await insertPot(db, { userId });
    await insertPot(db, { userId });
    await insertPot(db, { userId });

    const results = await query.execute(userId, 4);

    expect(results).toHaveLength(4);
  });

  it("returns all pots when user has fewer than limit", async () => {
    const userId = createId();
    await insertPot(db, { userId });
    await insertPot(db, { userId });

    const results = await query.execute(userId, 4);

    expect(results).toHaveLength(2);
  });

  it("does not return archived pots", async () => {
    const userId = createId();
    const active = await insertPot(db, { userId });
    await insertPot(db, { userId, overrides: { archivedAt: new Date() } });

    const results = await query.execute(userId, 10);

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(active.id);
  });

  it("does not return another user's pots", async () => {
    const userA = createId();
    const userB = createId();
    await insertPot(db, { userId: userA });

    const results = await query.execute(userB, 10);

    expect(results).toHaveLength(0);
  });

  it("balances are income minus expense", async () => {
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
      amount: 500,
    });

    const results = await query.execute(userId, 1);

    expect(results[0].balance).toBe(1500);
  });
});
