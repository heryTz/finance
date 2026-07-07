import type { Id } from "src/server/domain/shared/value-object/id";
import type { Name } from "src/server/domain/shared/value-object/name";
import type { Tag } from "src/server/domain/tag/tag";
import type { TagRepository } from "src/server/domain/tag/tag.repository";

export class InMemoryTagRepository implements TagRepository {
  private store: Tag[] = [];

  all(): Tag[] {
    return this.store;
  }

  async save(tag: Tag): Promise<void> {
    const idx = this.store.findIndex(
      (t) => t.data.id.value === tag.data.id.value,
    );
    if (idx >= 0) this.store[idx] = tag;
    else this.store.push(tag);
  }

  async findAll(userId: Id): Promise<Tag[]> {
    return this.store.filter((t) => t.data.userId.value === userId.value);
  }

  async findById(id: Id, userId: Id): Promise<Tag | null> {
    return (
      this.store.find(
        (t) =>
          t.data.id.value === id.value && t.data.userId.value === userId.value,
      ) ?? null
    );
  }

  async existsByName(name: Name, userId: Id): Promise<boolean> {
    return this.store.some(
      (t) =>
        t.data.name.value === name.value &&
        t.data.userId.value === userId.value,
    );
  }

  async remove(id: Id, userId: Id): Promise<void> {
    this.store = this.store.filter(
      (t) =>
        !(t.data.id.value === id.value && t.data.userId.value === userId.value),
    );
  }
}
