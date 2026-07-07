import { and, eq } from "drizzle-orm";
import { SavedView } from "src/server/domain/saved-view/saved-view";
import type { SavedViewRepository } from "src/server/domain/saved-view/saved-view.repository";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
import { Id } from "src/server/domain/shared/value-object/id";
import { Name } from "src/server/domain/shared/value-object/name";
import { db } from "src/server/infrastructure/db/client";
import { savedViews } from "src/server/infrastructure/db/schema";

function rowToEntity(row: typeof savedViews.$inferSelect): SavedView {
  return new SavedView({
    id: new Id(row.id),
    userId: new Id(row.userId),
    name: new Name(row.name),
    description: row.description ?? null,
    nameFilter: row.nameFilter ?? null,
    tagIds: row.tagIds,
    createdAt: new Datetime(row.createdAt),
    updatedAt: row.updatedAt ? new Datetime(row.updatedAt) : null,
  });
}

export class DrizzleSavedViewRepository implements SavedViewRepository {
  async save(view: SavedView): Promise<void> {
    const d = view.data;
    await db
      .insert(savedViews)
      .values({
        id: d.id.value,
        userId: d.userId.value,
        name: d.name.value,
        description: d.description,
        nameFilter: d.nameFilter,
        tagIds: d.tagIds,
        createdAt: d.createdAt.value,
      })
      .onConflictDoUpdate({
        target: savedViews.id,
        set: {
          name: d.name.value,
          description: d.description,
          nameFilter: d.nameFilter,
          tagIds: d.tagIds,
        },
      });
  }

  async findById(id: Id, userId: Id): Promise<SavedView | null> {
    const [row] = await db
      .select()
      .from(savedViews)
      .where(
        and(eq(savedViews.id, id.value), eq(savedViews.userId, userId.value)),
      );
    return row ? rowToEntity(row) : null;
  }

  async existsByName(name: Name, userId: Id): Promise<boolean> {
    const [row] = await db
      .select({ id: savedViews.id })
      .from(savedViews)
      .where(
        and(
          eq(savedViews.name, name.value),
          eq(savedViews.userId, userId.value),
        ),
      );
    return !!row;
  }

  async remove(id: Id, userId: Id): Promise<void> {
    await db
      .delete(savedViews)
      .where(
        and(eq(savedViews.id, id.value), eq(savedViews.userId, userId.value)),
      );
  }
}
