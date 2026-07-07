import type { SavedView } from "src/server/domain/saved-view/saved-view";
import type { SavedViewRepository } from "src/server/domain/saved-view/saved-view.repository";
import type { Id } from "src/server/domain/shared/value-object/id";
import type { Name } from "src/server/domain/shared/value-object/name";

export class InMemorySavedViewRepository implements SavedViewRepository {
  private store: SavedView[] = [];

  all(): SavedView[] {
    return this.store;
  }

  async save(view: SavedView): Promise<void> {
    const idx = this.store.findIndex(
      (v) => v.data.id.value === view.data.id.value,
    );
    if (idx >= 0) this.store[idx] = view;
    else this.store.push(view);
  }

  async findById(id: Id, userId: Id): Promise<SavedView | null> {
    return (
      this.store.find(
        (v) =>
          v.data.id.value === id.value && v.data.userId.value === userId.value,
      ) ?? null
    );
  }

  async existsByName(name: Name, userId: Id): Promise<boolean> {
    return this.store.some(
      (v) =>
        v.data.name.value === name.value &&
        v.data.userId.value === userId.value,
    );
  }

  async remove(id: Id, userId: Id): Promise<void> {
    this.store = this.store.filter(
      (v) =>
        !(v.data.id.value === id.value && v.data.userId.value === userId.value),
    );
  }
}
