import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const pots = pgTable(
  "pots",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    percentage: integer("percentage").notNull(),
    color: text("color").notNull(),
    isDefault: boolean("is_default").notNull(),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (t) => [
    index("pots_user_id_idx").on(t.userId),
    uniqueIndex("pots_user_default_idx")
      .on(t.userId)
      .where(sql`${t.isDefault} = true`),
  ],
);
