import { Id } from "../shared/value-object/id";
import { Expense } from "./expense";

export interface ExpenseRepository {
  save(expense: Expense): Promise<void>;
  findOne(id: Id, userId: Id): Promise<Expense | null>;
}
