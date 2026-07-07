import type { Id } from "../shared/value-object/id";
import type { Name } from "../shared/value-object/name";

export interface UserRepository {
  updateName(userId: Id, name: Name): Promise<void>;
}
