import { createId } from "@paralleldrive/cuid2";
import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const tags = pgTable(
  "tags",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("tags_name_user_id_unique").on(t.name, t.userId),
    index("tags_user_id_idx").on(t.userId),
  ],
);
