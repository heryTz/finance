import { Income } from "@/server/domain/income/income";
import { IncomeRepository } from "@/server/domain/income/income.repository";
import { Id } from "@/server/domain/shared/value-object/id";

export class InMemoryIncomeRepository implements IncomeRepository {
  private store: Income[] = [];

  async save(income: Income): Promise<void> {
    this.store.push(income);
  }

  async findOne(id: Id, userId: Id): Promise<Income | null> {
    return this.store.find((i) => i.data.id.isEqual(id)) ?? null;
  }

  all() {
    return this.store;
  }
}
