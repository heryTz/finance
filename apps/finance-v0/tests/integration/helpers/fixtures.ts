import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";
import {
  expenseAllocationsV2,
  potAllocationsV2,
  potsV2,
  tagsV2,
  transactionTagsV2,
  transactionsV2,
} from "@/server/infrastructure/db/schema";
import { TestDb } from "./db";

type NewPot = typeof potsV2.$inferInsert;
type NewTransaction = typeof transactionsV2.$inferInsert;
type NewTag = typeof tagsV2.$inferInsert;

export async function insertPot(
  db: TestDb,
  { userId, overrides }: { userId: string; overrides?: Partial<NewPot> },
) {
  const [row] = await db
    .insert(potsV2)
    .values({
      id: createId(),
      name: faker.finance.accountName(),
      percentage: faker.number.int({ min: 1, max: 100 }),
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
    .insert(transactionsV2)
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
    .insert(tagsV2)
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
    .insert(potAllocationsV2)
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
    .insert(expenseAllocationsV2)
    .values({ id: createId(), transactionId, potId, amount })
    .returning();
  return row;
}

export async function insertTransactionTag(
  db: TestDb,
  { transactionId, tagId }: { transactionId: string; tagId: string },
) {
  const [row] = await db
    .insert(transactionTagsV2)
    .values({ transactionId, tagId })
    .returning();
  return row;
}
