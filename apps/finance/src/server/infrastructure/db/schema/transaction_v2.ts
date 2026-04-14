// src/server/infrastructure/db/schema/transaction_v2.ts
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
import { createId } from "@paralleldrive/cuid2";
import { potsV2 } from "./pot_v2";
import { tagsV2 } from "./tag_v2";

export const transactionTypeV2 = pgEnum("transaction_type_v2", [
  "income",
  "expense",
]);

export const transactionsV2 = pgTable(
  "transactions_v2",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    type: transactionTypeV2("type").notNull(),
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
  },
  (t) => [
    // Primary query pattern: paginated list filtered by type, ordered newest-first
    index("transactions_v2_type_created_at_idx").on(t.type, t.createdAt),
    // Unified "all transactions" view without type filter
    index("transactions_v2_created_at_idx").on(t.createdAt),
    index("transactions_v2_user_id_idx").on(t.userId),
  ],
);

export const potAllocationsV2 = pgTable(
  "pot_allocations_v2",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    transactionId: text("transaction_id")
      .notNull()
      .references(() => transactionsV2.id, { onDelete: "cascade" }),
    potId: text("pot_id")
      .notNull()
      .references(() => potsV2.id, { onDelete: "restrict" }),
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
    // Covers both uniqueness and transaction_id prefix lookups
    uniqueIndex("pot_allocations_v2_transaction_id_pot_id_idx").on(
      t.transactionId,
      t.potId,
    ),
    // For pot balance queries: sum allocations per pot
    index("pot_allocations_v2_pot_id_idx").on(t.potId),
  ],
);

export const expenseAllocationsV2 = pgTable(
  "expense_allocations_v2",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    transactionId: text("transaction_id")
      .notNull()
      .references(() => transactionsV2.id, { onDelete: "cascade" }),
    potId: text("pot_id")
      .notNull()
      .references(() => potsV2.id, { onDelete: "restrict" }),
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
    uniqueIndex("expense_allocations_v2_transaction_id_pot_id_idx").on(
      t.transactionId,
      t.potId,
    ),
    index("expense_allocations_v2_pot_id_idx").on(t.potId),
  ],
);

export const transactionTagsV2 = pgTable(
  "transaction_tags_v2",
  {
    transactionId: text("transaction_id")
      .notNull()
      .references(() => transactionsV2.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tagsV2.id, { onDelete: "restrict" }),
  },
  (t) => [
    // Composite PK with transaction_id as leading column — covers transaction-side lookups
    primaryKey({ columns: [t.transactionId, t.tagId] }),
    // For tag-side lookups: find all transactions for a given tag
    index("transaction_tags_v2_tag_id_idx").on(t.tagId),
  ],
);
