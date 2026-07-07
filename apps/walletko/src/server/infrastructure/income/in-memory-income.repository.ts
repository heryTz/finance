import type { Income } from "src/server/domain/income/income";
import type { IncomeRepository } from "src/server/domain/income/income.repository";
import type { Id } from "src/server/domain/shared/value-object/id";

export class InMemoryIncomeRepository implements IncomeRepository {
  private store: Income[] = [];
  private canceledIds = new Set<string>();

  async save(income: Income): Promise<void> {
    this.store.push(income);
  }

  async findOne(id: Id, _userId: Id): Promise<Income | null> {
    return this.store.find((i) => i.data.id.isEqual(id)) ?? null;
  }

  async update(income: Income): Promise<void> {
    const index = this.store.findIndex((i) =>
      i.data.id.isEqual(income.data.id),
    );
    if (index !== -1) this.store[index] = income;
  }

  async delete(id: Id, _userId: Id): Promise<void> {
    this.store = this.store.filter((i) => !i.data.id.isEqual(id));
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
