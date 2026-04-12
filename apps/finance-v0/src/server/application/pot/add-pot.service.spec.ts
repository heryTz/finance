import { AddPotService } from "./add-pot.service";
import { InMemoryIncomeRepository } from "@/server/infrastructure/income/in-memory-income.repository";
import { InMemoryExpenseRepository } from "@/server/infrastructure/expense/in-memory-expense.repository";
import { InMemoryPotRepository } from "@/server/infrastructure/pot-collection/in-memory-pot.repository";
import { makePot } from "@/server/domain/pot-collection/pot.factory";
import { Percentage } from "@/server/domain/shared/value-object/percentage";
import { Id } from "@/server/domain/shared/value-object/id";
import { InMemoryUnitOfWork } from "@/server/infrastructure/shared/in-memory-unit-of-work";

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
    addPotService = new AddPotService({
      potRepo,
      uow,
    });
  });

  it("store with correct name, balance and percentage", async () => {
    const defaultPot = makePot({ percentage: new Percentage(100) });
    potRepo.all().push(defaultPot);
    const { id } = await addPotService.execute({
      name: "Pot",
      percentage: 10,
      otherPots: [
        {
          id: defaultPot.data.id.value,
          percentage: 90,
        },
      ],
      userId,
    });
    const newPot = potRepo.all().find((el) => el.data.id.isEqual(new Id(id)))!;
    expect(newPot.data.name.value).toBe("Pot");
    expect(newPot.data.percentage.value).toBe(10);
  });

  it("commit unit of work", async () => {
    const defaultPot = makePot({ percentage: new Percentage(100) });
    potRepo.all().push(defaultPot);
    const commitSpy = jest.spyOn(uow, "commit");
    await addPotService.execute({
      name: "Pot",
      percentage: 10,
      otherPots: [{ id: defaultPot.data.id.value, percentage: 90 }],
      userId,
    });
    expect(commitSpy).toHaveBeenCalledTimes(1);
  });
});
