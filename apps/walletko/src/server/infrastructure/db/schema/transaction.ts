import { createId } from "@paralleldrive/cuid2";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { pots } from "./pot";
import { tags } from "./tag";

export const transactionType = pgEnum("transaction_type", [
  "income",
  "expense",
  "transfer",
  "canceled_income",
  "income_cancellation",
  "canceled_expense",
  "expense_cancellation",
]);

export const transactions = pgTable(
  "transactions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    type: transactionType("type").notNull(),
    name: text("name").notNull(),
    amount: integer("amount").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    userId: text("user_id").notNull(),
    cancelsTransactionId: text("cancels_transaction_id"),
  },
  (t) => [
    index("transactions_type_created_at_idx").on(t.type, t.createdAt),
    index("transactions_created_at_idx").on(t.createdAt),
    index("transactions_user_id_idx").on(t.userId),
  ],
);

export const potAllocations = pgTable(
  "pot_allocations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    transactionId: text("transaction_id")
      .notNull()
      .references(() => transactions.id, { onDelete: "cascade" }),
    potId: text("pot_id")
      .notNull()
      .references(() => pots.id, { onDelete: "restrict" }),
    amount: integer("amount").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("pot_allocations_transaction_id_pot_id_idx").on(
      t.transactionId,
      t.potId,
    ),
    index("pot_allocations_pot_id_idx").on(t.potId),
  ],
);

export const expenseAllocations = pgTable(
  "expense_allocations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    transactionId: text("transaction_id")
      .notNull()
      .references(() => transactions.id, { onDelete: "cascade" }),
    potId: text("pot_id")
      .notNull()
      .references(() => pots.id, { onDelete: "restrict" }),
    amount: integer("amount").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("expense_allocations_transaction_id_pot_id_idx").on(
      t.transactionId,
      t.potId,
    ),
    index("expense_allocations_pot_id_idx").on(t.potId),
  ],
);

export const transactionTags = pgTable(
  "transaction_tags",
  {
    transactionId: text("transaction_id")
      .notNull()
      .references(() => transactions.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "restrict" }),
  },
  (t) => [
    primaryKey({ columns: [t.transactionId, t.tagId] }),
    index("transaction_tags_tag_id_idx").on(t.tagId),
  ],
);
