import { InMemoryIncomeRepository } from "src/server/infrastructure/income/in-memory-income.repository";
import { InMemoryExpenseRepository } from "src/server/infrastructure/expense/in-memory-expense.repository";
import { InMemoryPotRepository } from "src/server/infrastructure/pot-collection/in-memory-pot.repository";
import { InMemoryUnitOfWork } from "src/server/infrastructure/shared/in-memory-unit-of-work";
import { ReceiveIncomeService } from "src/server/application/income/receive-income.service";
import { Id } from "src/server/domain/shared/value-object/id";
import { makePot } from "src/server/domain/pot-collection/pot.factory";
import { Percentage } from "src/server/domain/shared/value-object/percentage";

describe("receive income", () => {
  const userId = Id.generate().value;
  let incomeRepo: InMemoryIncomeRepository;
  let uow: InMemoryUnitOfWork;
  let potRepo: InMemoryPotRepository;
  let receiveIncome: ReceiveIncomeService;

  beforeEach(() => {
    incomeRepo = new InMemoryIncomeRepository();
    uow = new InMemoryUnitOfWork();
    potRepo = new InMemoryPotRepository({
      incomeRepository: incomeRepo,
      expenseRepository: new InMemoryExpenseRepository(),
    });
    receiveIncome = new ReceiveIncomeService({
      incomeRepo,
      uow,
      potRepo,
    });
  });

  it("store with correct name, amount and tags", async () => {
    await potRepo.save(makePot({ percentage: new Percentage(100) }));
    await receiveIncome.execute({
      name: "Mission",
      amount: 100,
      tags: [{ id: Id.generate().value, name: "tag" }],
      userId,
    });
    const stored = incomeRepo.all()[0];
    expect(stored.data.name.value).toBe("Mission");
    expect(stored.data.amount.value).toBe(100);
    expect(stored.data.tags.length).toBe(1);
    expect(stored.data.tags[0].data.name.value).toBe("tag");
  });

  it("store with correct allocations", async () => {
    await potRepo.save(makePot({ percentage: new Percentage(100) }));
    await receiveIncome.execute({
      name: "Mission",
      amount: 100,
      tags: [],
      userId,
    });
    const stored = incomeRepo.all()[0];
    expect(stored.data.allocations.length).toBe(1);
    expect(stored.data.allocations[0].data.amount.value).toBe(100);
  });

  it("commit unit of work", async () => {
    const commitSpy = vi.spyOn(uow, "commit");
    await potRepo.save(makePot({ percentage: new Percentage(100) }));
    await receiveIncome.execute({
      name: "Mission",
      amount: 100,
      tags: [],
      userId,
    });
    expect(commitSpy).toHaveBeenCalledTimes(1);
  });

  it("stores income with provided createdAt", async () => {
    await potRepo.save(makePot({ percentage: new Percentage(100) }));
    const createdAt = new Date("2025-06-01T14:30:00.000Z");
    await receiveIncome.execute({
      name: "Mission",
      amount: 100,
      tags: [],
      userId,
      createdAt,
    });
    const stored = incomeRepo.all()[0];
    expect(stored.data.createdAt.value).toEqual(createdAt);
  });
});
