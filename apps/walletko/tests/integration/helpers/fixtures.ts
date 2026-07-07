import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";
import {
  expenseAllocations,
  potAllocations,
  pots,
  tags,
  transactionTags,
  transactions,
} from "src/server/infrastructure/db/schema";
import type { TestDb } from "./db";

type NewPot = typeof pots.$inferInsert;
type NewTransaction = typeof transactions.$inferInsert;
type NewTag = typeof tags.$inferInsert;

export async function insertPot(
  db: TestDb,
  { userId, overrides }: { userId: string; overrides?: Partial<NewPot> },
) {
  const [row] = await db
    .insert(pots)
    .values({
      id: createId(),
      name: faker.finance.accountName(),
      percentage: faker.number.int({ min: 1, max: 100 }),
      color: "#4fb8b2",
      isDefault: false,
      userId,
      ...overrides,
    })
    .returning();
  return row;
}

export async function insertTransaction(
  db: TestDb,
  {
    userId,
    overrides,
  }: { userId: string; overrides?: Partial<NewTransaction> },
) {
  const [row] = await db
    .insert(transactions)
    .values({
      id: createId(),
      type: "income",
      name: faker.finance.transactionDescription(),
      amount: faker.number.int({ min: 100, max: 100000 }),
      userId,
      ...overrides,
    })
    .returning();
  return row;
}

export async function insertTag(
  db: TestDb,
  { userId, overrides }: { userId: string; overrides?: Partial<NewTag> },
) {
  const [row] = await db
    .insert(tags)
    .values({
      id: createId(),
      name: faker.word.noun(),
      userId,
      ...overrides,
    })
    .returning();
  return row;
}

export async function insertPotAllocation(
  db: TestDb,
  {
    transactionId,
    potId,
    amount,
  }: { transactionId: string; potId: string; amount: number },
) {
  const [row] = await db
    .insert(potAllocations)
    .values({ id: createId(), transactionId, potId, amount })
    .returning();
  return row;
}

export async function insertExpenseAllocation(
  db: TestDb,
  {
    transactionId,
    potId,
    amount,
  }: { transactionId: string; potId: string; amount: number },
) {
  const [row] = await db
    .insert(expenseAllocations)
    .values({ id: createId(), transactionId, potId, amount })
    .returning();
  return row;
}

export async function insertTransactionTag(
  db: TestDb,
  { transactionId, tagId }: { transactionId: string; tagId: string },
) {
  const [row] = await db
    .insert(transactionTags)
    .values({ transactionId, tagId })
    .returning();
  return row;
}
