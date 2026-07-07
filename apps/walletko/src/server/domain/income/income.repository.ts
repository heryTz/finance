import type { Id } from "../shared/value-object/id";
import type { Income } from "./income";

export interface IncomeRepository {
  save(income: Income): Promise<void>;
  update(income: Income): Promise<void>;
  findOne(id: Id, userId: Id): Promise<Income | null>;
  delete(id: Id, userId: Id): Promise<void>;
  markCanceled(id: Id, userId: Id): Promise<void>;
}
