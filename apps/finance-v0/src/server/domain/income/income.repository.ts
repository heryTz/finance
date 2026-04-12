import { Id } from "../shared/value-object/id";
import { Income } from "./income";

export interface IncomeRepository {
  save(income: Income): Promise<void>;
  findOne(id: Id, userId: Id): Promise<Income | null>;
}
