import type { Pot } from "src/server/domain/pot-collection/pot";
import type { PotRepository } from "src/server/domain/pot-collection/pot.repository";
import { PotSnapshot } from "src/server/domain/pot-collection/value-object/pot-snapshot";
import type { Id } from "src/server/domain/shared/value-object/id";
import { Money } from "src/server/domain/shared/value-object/money";
import type { InMemoryExpenseRepository } from "../expense/in-memory-expense.repository";
import type { InMemoryIncomeRepository } from "../income/in-memory-income.repository";

export class InMemoryPotRepository implements PotRepository {
  private store: Pot[] = [];

  constructor(
    private readonly ctx: {
      incomeRepository: InMemoryIncomeRepository;
      expenseRepository: InMemoryExpenseRepository;
    },
  ) {}

  async save(pot: Pot): Promise<void> {
    const index = this.store.findIndex((p) => p.data.id.isEqual(pot.data.id));
    if (index !== -1) {
      this.store[index] = pot;
    } else {
      this.store.push(pot);
    }
  }

  async findAll(_userId: Id): Promise<Pot[]> {
    return this.store.filter((p) => p.data.archivedAt === null);
  }

  async findAllWithArchived(_userId: Id): Promise<Pot[]> {
    return this.store;
  }

  async findSnapshot(_userId: Id): Promise<PotSnapshot[]> {
    return this.store
      .filter((pot) => pot.data.archivedAt === null)
      .map((pot) => {
        const incomeTotal = this.ctx.incomeRepository
          .all()
          .flatMap((income) => income.data.allocations)
          .filter((allocation) => allocation.data.potId.isEqual(pot.data.id))
          .reduce(
            (sum, allocation) => sum.add(allocation.data.amount),
            Money.fromCents(0),
          );

        const expenseTotal = this.ctx.expenseRepository
          .all()
          .flatMap((expense) => expense.data.allocations)
          .filter((allocation) => allocation.data.potId.isEqual(pot.data.id))
          .reduce(
            (sum, allocation) => sum.add(allocation.data.amount),
            Money.fromCents(0),
          );

        return new PotSnapshot({
          pot,
          balance: incomeTotal.substract(expenseTotal),
        });
      });
  }

  all() {
    return this.store;
  }
}
