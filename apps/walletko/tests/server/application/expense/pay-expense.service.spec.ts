import { InMemoryExpenseRepository } from "src/server/infrastructure/expense/in-memory-expense.repository";
import { InMemoryPotRepository } from "src/server/infrastructure/pot-collection/in-memory-pot.repository";
import { InMemoryUnitOfWork } from "src/server/infrastructure/shared/in-memory-unit-of-work";
import { PayExpenseService } from "src/server/application/expense/pay-expense.service";
import { Id } from "src/server/domain/shared/value-object/id";
import { makePot } from "src/server/domain/pot-collection/pot.factory";
import { Money } from "src/server/domain/shared/value-object/money";
import { InMemoryIncomeRepository } from "src/server/infrastructure/income/in-memory-income.repository";
import { makeIncome } from "src/server/domain/income/income.factory";
import { makePotAllocation } from "src/server/domain/income/pot-allocation.factory";
import { Percentage } from "src/server/domain/shared/value-object/percentage";

describe("pay expense", () => {
  const userId = Id.generate().value;
  let uow: InMemoryUnitOfWork;
  let potRepo: InMemoryPotRepository;
  let expenseRepo: InMemoryExpenseRepository;
  let incomeRepo: InMemoryIncomeRepository;
  let payExpense: PayExpenseService;

  beforeEach(() => {
    uow = new InMemoryUnitOfWork();
    incomeRepo = new InMemoryIncomeRepository();
    expenseRepo = new InMemoryExpenseRepository();
    potRepo = new InMemoryPotRepository({
      incomeRepository: incomeRepo,
      expenseRepository: expenseRepo,
    });
    payExpense = new PayExpenseService({ uow, potRepo, expenseRepo });
  });

  it("throws when empty draw", async () => {
    expect.assertions(1);
    const potId = Id.generate();
    const pot = makePot({ id: potId, percentage: new Percentage(100) });
    potRepo.all().push(pot);
    const incomeId = Id.generate();
    const income = makeIncome({
      id: incomeId,
      allocations: [
        makePotAllocation({ incomeId, potId, amount: new Money(20) }),
      ],
    });
    incomeRepo.all().push(income);
    try {
      await payExpense.execute({
        name: "Car",
        drawFrom: [],
        tags: [],
        userId,
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("store with name and tags", async () => {
    const potId = Id.generate();
    const pot = makePot({ id: potId, percentage: new Percentage(100) });
    potRepo.all().push(pot);
    const incomeId = Id.generate();
    const income = makeIncome({
      id: incomeId,
      allocations: [
        makePotAllocation({ incomeId, potId, amount: new Money(20) }),
      ],
    });
    incomeRepo.all().push(income);
    await payExpense.execute({
      name: "Car",
      drawFrom: [{ potId: potId.value, amount: 10 }],
      tags: [{ id: Id.generate().value, name: "tag1" }],
      userId,
    });
    const newExpense = expenseRepo.all()[0];
    expect(newExpense.data.name.value).toBe("Car");
    expect(newExpense.data.tags.length).toBe(1);
    expect(newExpense.data.tags[0].data.name.value).toBe("tag1");
  });

  it("commit unit of work", async () => {
    const potId = Id.generate();
    const pot = makePot({ id: potId, percentage: new Percentage(100) });
    potRepo.all().push(pot);
    const incomeId = Id.generate();
    const income = makeIncome({
      id: incomeId,
      allocations: [
        makePotAllocation({ incomeId, potId, amount: new Money(20) }),
      ],
    });
    incomeRepo.all().push(income);
    const commitSpy = vi.spyOn(uow, "commit");
    await payExpense.execute({
      name: "Car",
      drawFrom: [{ potId: potId.value, amount: 10 }],
      tags: [{ id: Id.generate().value, name: "tag1" }],
      userId,
    });
    expect(commitSpy).toHaveBeenCalledTimes(1);
  });
});
