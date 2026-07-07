import { AddPotService } from "src/server/application/pot/add-pot.service";
import { InMemoryIncomeRepository } from "src/server/infrastructure/income/in-memory-income.repository";
import { InMemoryExpenseRepository } from "src/server/infrastructure/expense/in-memory-expense.repository";
import { InMemoryPotRepository } from "src/server/infrastructure/pot-collection/in-memory-pot.repository";
import { makePot } from "src/server/domain/pot-collection/pot.factory";
import { Percentage } from "src/server/domain/shared/value-object/percentage";
import { Id } from "src/server/domain/shared/value-object/id";
import { InMemoryUnitOfWork } from "src/server/infrastructure/shared/in-memory-unit-of-work";

describe("add pot", () => {
  const userId = Id.generate().value;
  let potRepo: InMemoryPotRepository;
  let addPotService: AddPotService;
  let uow: InMemoryUnitOfWork;

  beforeEach(() => {
    potRepo = new InMemoryPotRepository({
      incomeRepository: new InMemoryIncomeRepository(),
      expenseRepository: new InMemoryExpenseRepository(),
    });
    uow = new InMemoryUnitOfWork();
    addPotService = new AddPotService({ potRepo, uow });
  });

  it("store with correct name, balance and percentage", async () => {
    const defaultPot = makePot({ percentage: new Percentage(100) });
    potRepo.all().push(defaultPot);
    const { id } = await addPotService.execute({
      name: "Pot",
      percentage: 10,
      color: "#ff0000",
      otherPots: [{ id: defaultPot.data.id.value, percentage: 90 }],
      userId,
    });
    const newPot = potRepo.all().find((el) => el.data.id.isEqual(new Id(id)))!;
    expect(newPot.data.name.value).toBe("Pot");
    expect(newPot.data.percentage.value).toBe(10);
    expect(newPot.data.color.value).toBe("#ff0000");
    expect(newPot.data.isDefault).toBe(false);
  });

  it("commit unit of work", async () => {
    const defaultPot = makePot({ percentage: new Percentage(100) });
    potRepo.all().push(defaultPot);
    const commitSpy = vi.spyOn(uow, "commit");
    await addPotService.execute({
      name: "Pot",
      percentage: 10,
      color: "#ff0000",
      otherPots: [{ id: defaultPot.data.id.value, percentage: 90 }],
      userId,
    });
    expect(commitSpy).toHaveBeenCalledTimes(1);
  });
});
