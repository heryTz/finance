import type { Id } from "../shared/value-object/id";
import type { Pot } from "./pot";
import type { PotSnapshot } from "./value-object/pot-snapshot";

export interface PotRepository {
  save(pot: Pot): Promise<void>;
  findAll(userId: Id): Promise<Pot[]>;
  findAllWithArchived(userId: Id): Promise<Pot[]>;
  findSnapshot(userId: Id): Promise<PotSnapshot[]>;
}
