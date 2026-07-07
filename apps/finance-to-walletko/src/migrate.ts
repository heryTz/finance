import { createId } from "@paralleldrive/cuid2";
import pg from "pg";
import { decimalStringToCents } from "./amount";

const DEFAULT_POT_NAME = "Main";
const DEFAULT_POT_PERCENTAGE = 100;
const DEFAULT_POT_COLOR = "#64748b";
const MAX_WALLETKO_AMOUNT_CENTS = 2_147_483_647;

export type MigrationSummary = {
  users: number;
  pots: number;
  tags: number;
  incomeTransactions: number;
  expenseTransactions: number;
  potAllocations: number;
  expenseAllocations: number;
  transactionTags: number;
  skippedOperations: number;
};

type FinanceUser = {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type FinanceTag = {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
};

type FinanceOperation = {
  id: string;
  label: string;
  amount: string;
  type: string;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

type OperationTag = { operationId: string; tagId: string };

async function connectOrThrow(client: pg.Client, label: string): Promise<void> {
  try {
    await client.connect();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to connect to the ${label} database: ${message}`);
  }
}

export async function migrate(opts: {
  financeUrl: string;
  walletkoUrl: string;
}): Promise<MigrationSummary> {
  const finance = new pg.Client({
    connectionString: opts.financeUrl,
    connectionTimeoutMillis: 15_000,
  });
  const walletko = new pg.Client({
    connectionString: opts.walletkoUrl,
    connectionTimeoutMillis: 15_000,
  });
  await connectOrThrow(finance, "finance");
  await connectOrThrow(walletko, "walletko");

  const summary: MigrationSummary = {
    users: 0,
    pots: 0,
    tags: 0,
    incomeTransactions: 0,
    expenseTransactions: 0,
    potAllocations: 0,
    expenseAllocations: 0,
    transactionTags: 0,
    skippedOperations: 0,
  };

  try {
    const users = (
      await finance.query<FinanceUser>(
        `SELECT id, email, name, "emailVerified", image, "createdAt", "updatedAt" FROM "User"`,
      )
    ).rows;
    const tags = (
      await finance.query<FinanceTag>(
        `SELECT id, name, "userId", "createdAt" FROM "Tag"`,
      )
    ).rows;
    const operations = (
      await finance.query<FinanceOperation>(
        `SELECT id, label, amount, type, "userId", "createdAt", "updatedAt" FROM "Operation"`,
      )
    ).rows;
    const operationTags = (
      await finance.query<OperationTag>(
        `SELECT "A" AS "operationId", "B" AS "tagId" FROM "_OperationToTag"`,
      )
    ).rows;

    await walletko.query("BEGIN");

    const defaultPotIdByUser = new Map<string, string>();

    for (const user of users) {
      await walletko.query(
        `INSERT INTO "user"(id,name,email,email_verified,image,created_at,updated_at)
         VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING`,
        [
          user.id,
          user.name ?? user.email,
          user.email,
          user.emailVerified,
          user.image,
          user.createdAt,
          user.updatedAt,
        ],
      );
      summary.users++;

      await walletko.query(
        `INSERT INTO pots(id,name,percentage,color,is_default,user_id,created_at,updated_at,archived_at)
         VALUES($1,$2,$3,$4,true,$5,$6,NULL,NULL) ON CONFLICT DO NOTHING`,
        [
          createId(),
          DEFAULT_POT_NAME,
          DEFAULT_POT_PERCENTAGE,
          DEFAULT_POT_COLOR,
          user.id,
          user.createdAt,
        ],
      );
      const defaultPot = await walletko.query<{ id: string }>(
        `SELECT id FROM pots WHERE user_id = $1 AND is_default = true`,
        [user.id],
      );
      defaultPotIdByUser.set(user.id, defaultPot.rows[0].id);
      summary.pots++;
    }

    for (const tag of tags) {
      await walletko.query(
        `INSERT INTO tags(id,name,user_id,created_at)
         VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
        [tag.id, tag.name, tag.userId, tag.createdAt],
      );
      summary.tags++;
    }

    const migratedOperationIds = new Set<string>();
    const migratedTagIds = new Set(tags.map((tag) => tag.id));
    const migratedUserIds = new Set(users.map((user) => user.id));

    for (const op of operations) {
      if (op.userId === null || !migratedUserIds.has(op.userId)) {
        summary.skippedOperations++;
        continue;
      }

      if (op.type !== "revenue" && op.type !== "depense") {
        throw new Error(
          `Operation ${op.id} has an unexpected type "${op.type}" (expected "revenue" or "depense")`,
        );
      }

      const amountCents = decimalStringToCents(op.amount);
      if (amountCents > MAX_WALLETKO_AMOUNT_CENTS) {
        throw new Error(
          `Operation ${op.id} amount ${op.amount} exceeds walletko's maximum representable amount`,
        );
      }
      if (amountCents <= 0) {
        console.warn(
          `Operation ${op.id} has a non-positive amount (${op.amount})`,
        );
      }

      const isIncome = op.type === "revenue";
      const transactionType = isIncome ? "income" : "expense";
      const updatedAt = op.updatedAt ?? op.createdAt;

      await walletko.query(
        `INSERT INTO transactions(id,type,name,amount,created_at,updated_at,user_id,cancels_transaction_id)
         VALUES($1,$2,$3,$4,$5,$6,$7,NULL) ON CONFLICT DO NOTHING`,
        [
          op.id,
          transactionType,
          op.label,
          amountCents,
          op.createdAt,
          updatedAt,
          op.userId,
        ],
      );

      const potId = defaultPotIdByUser.get(op.userId);
      if (!potId) {
        throw new Error(`No default pot found for user ${op.userId}`);
      }
      const allocationTable = isIncome
        ? "pot_allocations"
        : "expense_allocations";
      await walletko.query(
        `INSERT INTO ${allocationTable}(id,transaction_id,pot_id,amount,created_at,updated_at)
         VALUES($1,$2,$3,$4,$5,$5) ON CONFLICT DO NOTHING`,
        [createId(), op.id, potId, amountCents, op.createdAt],
      );

      migratedOperationIds.add(op.id);
      if (isIncome) {
        summary.incomeTransactions++;
        summary.potAllocations++;
      } else {
        summary.expenseTransactions++;
        summary.expenseAllocations++;
      }
    }

    for (const link of operationTags) {
      if (!migratedOperationIds.has(link.operationId)) continue;
      if (!migratedTagIds.has(link.tagId)) continue;
      await walletko.query(
        `INSERT INTO transaction_tags(transaction_id,tag_id)
         VALUES($1,$2) ON CONFLICT DO NOTHING`,
        [link.operationId, link.tagId],
      );
      summary.transactionTags++;
    }

    await walletko.query("COMMIT");
    return summary;
  } catch (error) {
    await walletko.query("ROLLBACK");
    throw error;
  } finally {
    await finance.end();
    await walletko.end();
  }
}
