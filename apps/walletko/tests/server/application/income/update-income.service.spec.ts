import { InMemoryIncomeRepository } from "src/server/infrastructure/income/in-memory-income.repository";
import { InMemoryUnitOfWork } from "src/server/infrastructure/shared/in-memory-unit-of-work";
import { UpdateIncomeService } from "src/server/application/income/update-income.service";
import { ReceiveIncomeService } from "src/server/application/income/receive-income.service";
import { InMemoryPotRepository } from "src/server/infrastructure/pot-collection/in-memory-pot.repository";
import { InMemoryExpenseRepository } from "src/server/infrastructure/expense/in-memory-expense.repository";
import { Id } from "src/server/domain/shared/value-object/id";
import { makePot } from "src/server/domain/pot-collection/pot.factory";
import { Percentage } from "src/server/domain/shared/value-object/percentage";

describe("update income", () => {
  const userId = Id.generate().value;
  let incomeRepo: InMemoryIncomeRepository;
  let uow: InMemoryUnitOfWork;
  let potRepo: InMemoryPotRepository;
  let updateIncome: UpdateIncomeService;

  beforeEach(async () => {
    incomeRepo = new InMemoryIncomeRepository();
    uow = new InMemoryUnitOfWork();
    potRepo = new InMemoryPotRepository({
      incomeRepository: incomeRepo,
      expenseRepository: new InMemoryExpenseRepository(),
    });
    updateIncome = new UpdateIncomeService({ incomeRepo, uow });

    // Seed an income to update
    await potRepo.save(makePot({ percentage: new Percentage(100) }));
    await new ReceiveIncomeService({ incomeRepo, uow, potRepo }).execute({
      name: "Original",
      amount: 300,
      tags: [],
      userId,
    });
  });

  it("updates name, date, and tags on the stored income", async () => {
    const stored = incomeRepo.all()[0];
    const newDate = new Date("2025-06-01");

    await updateIncome.execute({
      id: stored.data.id.value,
      name: "Updated Name",
      date: newDate,
      tags: [{ id: Id.generate().value, name: "salary" }],
      userId,
    });

    const updated = incomeRepo.all()[0];
    expect(updated.data.name.value).toBe("Updated Name");
    expect(updated.data.createdAt.value).toEqual(newDate);
    expect(updated.data.tags.length).toBe(1);
    expect(updated.data.tags[0].data.name.value).toBe("salary");
  });

  it("does not change amount", async () => {
    const stored = incomeRepo.all()[0];

    await updateIncome.execute({
      id: stored.data.id.value,
      name: "Updated",
      date: new Date(),
      tags: [],
      userId,
    });

    const updated = incomeRepo.all()[0];
    expect(updated.data.amount.value).toBe(300);
  });

  it("throws when income not found", async () => {
    await expect(
      updateIncome.execute({
        id: Id.generate().value,
        name: "Ghost",
        date: new Date(),
        tags: [],
        userId,
      }),
    ).rejects.toThrow("Income not found");
  });

  it("commits unit of work", async () => {
    const stored = incomeRepo.all()[0];
    const commitSpy = vi.spyOn(uow, "commit");

    await updateIncome.execute({
      id: stored.data.id.value,
      name: "Updated",
      date: new Date(),
      tags: [],
      userId,
    });

    expect(commitSpy).toHaveBeenCalledTimes(1);
  });
});
