import type { ExpenseCancellation } from "src/server/domain/expense/expense-cancellation";
import type { ExpenseCancellationRepository } from "src/server/domain/expense/expense-cancellation.repository";

export class InMemoryExpenseCancellationRepository implements ExpenseCancellationRepository {
  private store: ExpenseCancellation[] = [];

  async save(cancellation: ExpenseCancellation): Promise<void> {
    this.store.push(cancellation);
  }

  all() {
    return this.store;
  }
}
