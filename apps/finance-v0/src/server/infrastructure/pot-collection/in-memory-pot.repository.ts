import { Pot } from "@/server/domain/pot-collection/pot";
import { PotRepository } from "@/server/domain/pot-collection/pot.repository";
import { PotSnapshot } from "@/server/domain/pot-collection/value-object/pot-snapshot";
import { Id } from "@/server/domain/shared/value-object/id";
import { Money } from "@/server/domain/shared/value-object/money";
import { InMemoryIncomeRepository } from "../income/in-memory-income.repository";
import { InMemoryExpenseRepository } from "../expense/in-memory-expense.repository";

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

  async findAll(userId: Id): Promise<Pot[]> {
    return this.store;
  }

  async findSnapshot(userId: Id): Promise<PotSnapshot[]> {
    return this.store.map((pot) => {
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
