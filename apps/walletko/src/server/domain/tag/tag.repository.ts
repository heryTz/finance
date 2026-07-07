import type { Id } from "../shared/value-object/id";
import type { Name } from "../shared/value-object/name";
import type { Tag } from "./tag";

export interface TagRepository {
  save(tag: Tag): Promise<void>;
  findAll(userId: Id): Promise<Tag[]>;
  findById(id: Id, userId: Id): Promise<Tag | null>;
  existsByName(name: Name, userId: Id): Promise<boolean>;
  remove(id: Id, userId: Id): Promise<void>;
}
