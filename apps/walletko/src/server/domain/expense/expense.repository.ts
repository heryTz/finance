import type { Id } from "../shared/value-object/id";
import type { Expense } from "./expense";

export interface ExpenseRepository {
  save(expense: Expense): Promise<void>;
  update(expense: Expense): Promise<void>;
  findOne(id: Id, userId: Id): Promise<Expense | null>;
  markCanceled(id: Id, userId: Id): Promise<void>;
}
