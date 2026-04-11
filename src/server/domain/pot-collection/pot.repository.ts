import { Id } from "../shared/value-object/id";
import { Pot } from "./pot";
import { PotSnapshot } from "./value-object/pot-snapshot";

export interface PotRepository {
  save(pot: Pot): Promise<void>;
  findAll(userId: Id): Promise<Pot[]>;
  findSnapshot(userId: Id): Promise<PotSnapshot[]>;
}
