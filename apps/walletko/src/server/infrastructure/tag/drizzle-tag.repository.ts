import { and, eq } from "drizzle-orm";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
import { Id } from "src/server/domain/shared/value-object/id";
import { Name } from "src/server/domain/shared/value-object/name";
import { Tag } from "src/server/domain/tag/tag";
import type { TagRepository } from "src/server/domain/tag/tag.repository";
import { db } from "src/server/infrastructure/db/client";
import { tags } from "src/server/infrastructure/db/schema";

export class DrizzleTagRepository implements TagRepository {
  async findAll(userId: Id): Promise<Tag[]> {
    const rows = await db
      .select()
      .from(tags)
      .where(eq(tags.userId, userId.value));
    return rows.map(
      (row) =>
        new Tag({
          id: new Id(row.id),
          name: new Name(row.name),
          userId,
          createdAt: new Datetime(row.createdAt),
          updatedAt: null,
        }),
    );
  }

  async save(tag: Tag): Promise<void> {
    await db
      .insert(tags)
      .values({
        id: tag.data.id.value,
        name: tag.data.name.value,
        userId: tag.data.userId.value,
        createdAt: tag.data.createdAt.value,
      })
      .onConflictDoUpdate({
        target: tags.id,
        set: { name: tag.data.name.value },
      });
  }

  async findById(id: Id, userId: Id): Promise<Tag | null> {
    const [row] = await db
      .select()
      .from(tags)
      .where(and(eq(tags.id, id.value), eq(tags.userId, userId.value)));
    if (!row) return null;
    return new Tag({
      id: new Id(row.id),
      name: new Name(row.name),
      userId,
      createdAt: new Datetime(row.createdAt),
      updatedAt: null,
    });
  }

  async existsByName(name: Name, userId: Id): Promise<boolean> {
    const [row] = await db
      .select({ id: tags.id })
      .from(tags)
      .where(and(eq(tags.name, name.value), eq(tags.userId, userId.value)));
    return !!row;
  }

  async remove(id: Id, userId: Id): Promise<void> {
    await db
      .delete(tags)
      .where(and(eq(tags.id, id.value), eq(tags.userId, userId.value)));
  }
}
