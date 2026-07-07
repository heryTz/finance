import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";
import type pg from "pg";

const FINANCE_SCHEMA_PATH = fileURLToPath(
  new URL("./finance-schema.sql", import.meta.url),
);

const WALLETKO_MIGRATIONS_DIR = fileURLToPath(
  new URL(
    "../../walletko/src/server/infrastructure/db/migrations",
    import.meta.url,
  ),
);

export async function applyFinanceSchema(client: pg.Client): Promise<void> {
  const sql = await readFile(FINANCE_SCHEMA_PATH, "utf8");
  await client.query(sql);
}

export async function applyWalletkoSchema(client: pg.Client): Promise<void> {
  const files = (await readdir(WALLETKO_MIGRATIONS_DIR))
    .filter((file) => file.endsWith(".sql"))
    .sort();
  for (const file of files) {
    const sql = await readFile(
      path.join(WALLETKO_MIGRATIONS_DIR, file),
      "utf8",
    );
    const statements = sql
      .split("--> statement-breakpoint")
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0);
    for (const statement of statements) {
      await client.query(statement);
    }
  }
}

export type SeededOperation = {
  id: string;
  amountCents: number;
  type: "revenue" | "depense";
  userId: string | null;
};

export type SeedResult = {
  userIds: string[];
  tagIdsByUser: Map<string, string[]>;
  operations: SeededOperation[];
  operationTagCount: number;
};

export async function seedFinance(client: pg.Client): Promise<SeedResult> {
  faker.seed(20260707);
  const userIds: string[] = [];
  const tagIdsByUser = new Map<string, string[]>();
  const operations: SeededOperation[] = [];
  let operationTagCount = 0;

  const USER_COUNT = 4;
  const TAGS_PER_USER = 3;
  const OPS_PER_USER = 5;

  for (let u = 0; u < USER_COUNT; u++) {
    const userId = createId();
    userIds.push(userId);
    const name = u === 0 ? null : faker.person.fullName();
    await client.query(
      `INSERT INTO "User"(id,email,name,"emailVerified",image,"createdAt","updatedAt") VALUES($1,$2,$3,$4,$5,$6,$7)`,
      [
        userId,
        faker.internet.email(),
        name,
        true,
        null,
        new Date("2026-01-01T00:00:00Z"),
        new Date("2026-01-01T00:00:00Z"),
      ],
    );

    const tagIds: string[] = [];
    for (let t = 0; t < TAGS_PER_USER; t++) {
      const tagId = createId();
      tagIds.push(tagId);
      await client.query(
        `INSERT INTO "Tag"(id,name,"userId","createdAt") VALUES($1,$2,$3,$4)`,
        [
          tagId,
          `${faker.word.noun()}-${u}-${t}`,
          userId,
          new Date("2026-01-02T00:00:00Z"),
        ],
      );
    }
    tagIdsByUser.set(userId, tagIds);

    for (let o = 0; o < OPS_PER_USER; o++) {
      const opId = createId();
      const amountCents = faker.number.int({ min: 1, max: 500000 });
      const type = faker.helpers.arrayElement(["revenue", "depense"] as const);
      await client.query(
        `INSERT INTO "Operation"(id,label,amount,type,"userId","createdAt","updatedAt") VALUES($1,$2,$3,$4,$5,$6,$7)`,
        [
          opId,
          faker.commerce.productName(),
          (amountCents / 100).toFixed(2),
          type,
          userId,
          new Date("2026-03-01T00:00:00Z"),
          null,
        ],
      );
      operations.push({ id: opId, amountCents, type, userId });

      const linkTags = faker.helpers.arrayElements(
        tagIds,
        faker.number.int({ min: 0, max: 2 }),
      );
      for (const tagId of linkTags) {
        await client.query(
          `INSERT INTO "_OperationToTag"("A","B") VALUES($1,$2)`,
          [opId, tagId],
        );
        operationTagCount++;
      }
    }
  }

  const orphanId = createId();
  await client.query(
    `INSERT INTO "Operation"(id,label,amount,type,"userId","createdAt","updatedAt") VALUES($1,$2,$3,$4,$5,$6,$7)`,
    [
      orphanId,
      "orphan",
      "9.99",
      "revenue",
      null,
      new Date("2026-03-02T00:00:00Z"),
      null,
    ],
  );
  operations.push({
    id: orphanId,
    amountCents: 999,
    type: "revenue",
    userId: null,
  });

  return { userIds, tagIdsByUser, operations, operationTagCount };
}
