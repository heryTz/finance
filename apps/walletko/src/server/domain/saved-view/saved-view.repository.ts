import type { Id } from "../shared/value-object/id";
import type { Name } from "../shared/value-object/name";
import type { SavedView } from "./saved-view";

export interface SavedViewRepository {
  save(view: SavedView): Promise<void>;
  findById(id: Id, userId: Id): Promise<SavedView | null>;
  existsByName(name: Name, userId: Id): Promise<boolean>;
  remove(id: Id, userId: Id): Promise<void>;
}
