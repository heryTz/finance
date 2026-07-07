import type { Expense } from "src/server/domain/expense/expense";
import type { ExpenseRepository } from "src/server/domain/expense/expense.repository";
import type { Id } from "src/server/domain/shared/value-object/id";

export class InMemoryExpenseRepository implements ExpenseRepository {
  private store: Expense[] = [];
  private canceledIds = new Set<string>();

  async save(expense: Expense): Promise<void> {
    this.store.push(expense);
  }

  async update(expense: Expense): Promise<void> {
    const index = this.store.findIndex((e) =>
      e.data.id.isEqual(expense.data.id),
    );
    if (index !== -1) this.store[index] = expense;
  }

  async findOne(id: Id, _userId: Id): Promise<Expense | null> {
    return this.store.find((i) => i.data.id.isEqual(id)) ?? null;
  }

  async markCanceled(id: Id, _userId: Id): Promise<void> {
    this.canceledIds.add(id.value);
  }

  canceled() {
    return [...this.canceledIds];
  }

  all() {
    return this.store;
  }
}
