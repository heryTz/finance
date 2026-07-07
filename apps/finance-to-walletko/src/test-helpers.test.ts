import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  applyFinanceSchema,
  applyWalletkoSchema,
  seedFinance,
  type SeedResult,
} from "./test-helpers";

let financeContainer: StartedPostgreSqlContainer;
let walletkoContainer: StartedPostgreSqlContainer;
let finance: pg.Client;
let walletko: pg.Client;
let seed: SeedResult;

beforeAll(async () => {
  [financeContainer, walletkoContainer] = await Promise.all([
    new PostgreSqlContainer("postgres:16-alpine").start(),
    new PostgreSqlContainer("postgres:16-alpine").start(),
  ]);
  finance = new pg.Client({
    connectionString: financeContainer.getConnectionUri(),
  });
  walletko = new pg.Client({
    connectionString: walletkoContainer.getConnectionUri(),
  });
  await finance.connect();
  await walletko.connect();
  await applyFinanceSchema(finance);
  await applyWalletkoSchema(walletko);
  seed = await seedFinance(finance);
}, 120_000);

afterAll(async () => {
  await finance?.end();
  await walletko?.end();
  await Promise.all([financeContainer?.stop(), walletkoContainer?.stop()]);
});

describe("verification harness", () => {
  it("seeds finance with users, tags, and operations", async () => {
    expect(seed.userIds.length).toBe(4);
    const userCount = await finance.query<{ n: number }>(
      `SELECT COUNT(*)::int AS n FROM "User"`,
    );
    expect(userCount.rows[0].n).toBe(4);
    const opCount = await finance.query<{ n: number }>(
      `SELECT COUNT(*)::int AS n FROM "Operation"`,
    );
    expect(opCount.rows[0].n).toBe(seed.operations.length);
  });

  it("applies the walletko schema to an empty target", async () => {
    const userCount = await walletko.query<{ n: number }>(
      `SELECT COUNT(*)::int AS n FROM "user"`,
    );
    expect(userCount.rows[0].n).toBe(0);
    const potCount = await walletko.query<{ n: number }>(
      `SELECT COUNT(*)::int AS n FROM pots`,
    );
    expect(potCount.rows[0].n).toBe(0);
  });
});
