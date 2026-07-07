import { isCuid } from "@paralleldrive/cuid2";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { migrate } from "./migrate";
import {
  applyFinanceSchema,
  applyWalletkoSchema,
  seedFinance,
  type SeedResult,
} from "./test-helpers";

let financeContainer: StartedPostgreSqlContainer;
let walletkoContainer: StartedPostgreSqlContainer;
let financeUrl: string;
let walletkoUrl: string;
let finance: pg.Client;
let walletko: pg.Client;
let seed: SeedResult;

const count = async (client: pg.Client, table: string): Promise<number> => {
  const result = await client.query<{ n: number }>(
    `SELECT COUNT(*)::int AS n FROM ${table}`,
  );
  return result.rows[0].n;
};

const userAllocationSum = async (
  client: pg.Client,
  userId: string,
  table: "pot_allocations" | "expense_allocations",
  type: "income" | "expense",
): Promise<number> => {
  const result = await client.query<{ total: number }>(
    `SELECT COALESCE(SUM(a.amount), 0)::int AS total
     FROM ${table} a
     JOIN transactions t ON t.id = a.transaction_id
     JOIN pots p ON p.id = a.pot_id
     WHERE p.user_id = $1 AND t.type = $2`,
    [userId, type],
  );
  return result.rows[0].total;
};

beforeAll(async () => {
  [financeContainer, walletkoContainer] = await Promise.all([
    new PostgreSqlContainer("postgres:16-alpine").start(),
    new PostgreSqlContainer("postgres:16-alpine").start(),
  ]);
  financeUrl = financeContainer.getConnectionUri();
  walletkoUrl = walletkoContainer.getConnectionUri();
  finance = new pg.Client({ connectionString: financeUrl });
  walletko = new pg.Client({ connectionString: walletkoUrl });
  await finance.connect();
  await walletko.connect();
  await applyFinanceSchema(finance);
  await applyWalletkoSchema(walletko);
  seed = await seedFinance(finance);
  await migrate({ financeUrl, walletkoUrl });
}, 120_000);

afterAll(async () => {
  await finance?.end();
  await walletko?.end();
  await Promise.all([financeContainer?.stop(), walletkoContainer?.stop()]);
});

describe("migrate: users, pots, tags", () => {
  it("migrates every user", async () => {
    expect(await count(walletko, '"user"')).toBe(seed.userIds.length);
  });

  it("falls back to email when the finance name is null", async () => {
    const nullNameUsers = await finance.query<{ id: string; email: string }>(
      `SELECT id, email FROM "User" WHERE name IS NULL`,
    );
    expect(nullNameUsers.rows.length).toBeGreaterThan(0);
    for (const row of nullNameUsers.rows) {
      const migrated = await walletko.query<{ name: string }>(
        `SELECT name FROM "user" WHERE id = $1`,
        [row.id],
      );
      expect(migrated.rows[0].name).toBe(row.email);
    }
  });

  it("creates exactly one default pot per user at 100%", async () => {
    expect(await count(walletko, "pots")).toBe(seed.userIds.length);
    const pots = await walletko.query<{
      percentage: number;
      is_default: boolean;
    }>(`SELECT percentage, is_default FROM pots`);
    for (const pot of pots.rows) {
      expect(pot.percentage).toBe(100);
      expect(pot.is_default).toBe(true);
    }
  });

  it("migrates every tag", async () => {
    const financeTags = await count(finance, '"Tag"');
    expect(await count(walletko, "tags")).toBe(financeTags);
  });

  it("creates one transaction per operation with a user", async () => {
    const withUser = seed.operations.filter((op) => op.userId !== null);
    expect(await count(walletko, "transactions")).toBe(withUser.length);
  });

  it("skips operations without a user", async () => {
    const summary = await migrate({ financeUrl, walletkoUrl });
    const orphans = seed.operations.filter((op) => op.userId === null);
    expect(summary.skippedOperations).toBe(orphans.length);
  });

  it("creates exactly one allocation per income/expense transaction", async () => {
    const incomeOps = seed.operations.filter(
      (op) => op.userId !== null && op.type === "revenue",
    );
    const expenseOps = seed.operations.filter(
      (op) => op.userId !== null && op.type === "depense",
    );
    expect(await count(walletko, "pot_allocations")).toBe(incomeOps.length);
    expect(await count(walletko, "expense_allocations")).toBe(
      expenseOps.length,
    );
  });

  it("allocates the full transaction amount into the user's default pot", async () => {
    const rows = await walletko.query<{
      tx_amount: number;
      alloc_amount: number;
      is_default: boolean;
    }>(
      `SELECT t.amount AS tx_amount, a.amount AS alloc_amount, p.is_default
       FROM pot_allocations a
       JOIN transactions t ON t.id = a.transaction_id
       JOIN pots p ON p.id = a.pot_id
       UNION ALL
       SELECT t.amount AS tx_amount, a.amount AS alloc_amount, p.is_default
       FROM expense_allocations a
       JOIN transactions t ON t.id = a.transaction_id
       JOIN pots p ON p.id = a.pot_id`,
    );
    expect(rows.rows.length).toBeGreaterThan(0);
    for (const row of rows.rows) {
      expect(row.alloc_amount).toBe(row.tx_amount);
      expect(row.is_default).toBe(true);
    }
  });

  it("assigns valid cuid ids to migrated pots and allocations", async () => {
    const ids = await walletko.query<{ id: string }>(
      `SELECT id FROM pots
       UNION ALL SELECT id FROM pot_allocations
       UNION ALL SELECT id FROM expense_allocations`,
    );
    expect(ids.rows.length).toBeGreaterThan(0);
    for (const row of ids.rows) {
      expect(isCuid(row.id)).toBe(true);
    }
  });

  it("returns the same income/expense/balance per user as finance", async () => {
    for (const userId of seed.userIds) {
      const ops = seed.operations.filter((op) => op.userId === userId);
      const expectedIncome = ops
        .filter((op) => op.type === "revenue")
        .reduce((sum, op) => sum + op.amountCents, 0);
      const expectedExpense = ops
        .filter((op) => op.type === "depense")
        .reduce((sum, op) => sum + op.amountCents, 0);

      const income = await userAllocationSum(
        walletko,
        userId,
        "pot_allocations",
        "income",
      );
      const expense = await userAllocationSum(
        walletko,
        userId,
        "expense_allocations",
        "expense",
      );
      expect(income).toBe(expectedIncome);
      expect(expense).toBe(expectedExpense);
      expect(income - expense).toBe(expectedIncome - expectedExpense);
    }
  });

  it("migrates operation-tag links to transaction_tags", async () => {
    expect(await count(walletko, "transaction_tags")).toBe(
      seed.operationTagCount,
    );
  });

  it("is idempotent for users, pots, and tags", async () => {
    const before = {
      users: await count(walletko, '"user"'),
      pots: await count(walletko, "pots"),
      tags: await count(walletko, "tags"),
    };
    await migrate({ financeUrl, walletkoUrl });
    expect(await count(walletko, '"user"')).toBe(before.users);
    expect(await count(walletko, "pots")).toBe(before.pots);
    expect(await count(walletko, "tags")).toBe(before.tags);
  });
});
