import { Expense } from "@/server/domain/expense/expense";
import { ExpenseRepository } from "@/server/domain/expense/expense.repository";
import { Id } from "@/server/domain/shared/value-object/id";

export class InMemoryExpenseRepository implements ExpenseRepository {
  private store: Expense[] = [];

  async save(expense: Expense): Promise<void> {
    this.store.push(expense);
  }

  async findOne(id: Id, userId: Id): Promise<Expense | null> {
    return this.store.find((i) => i.data.id.isEqual(id)) ?? null;
  }

  all() {
    return this.store;
  }
}
