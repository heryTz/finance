import { EditPotService } from "src/server/application/pot/edit-pot.service";
import { InMemoryExpenseRepository } from "src/server/infrastructure/expense/in-memory-expense.repository";
import { InMemoryIncomeRepository } from "src/server/infrastructure/income/in-memory-income.repository";
import { InMemoryPotRepository } from "src/server/infrastructure/pot-collection/in-memory-pot.repository";
import { InMemoryUnitOfWork } from "src/server/infrastructure/shared/in-memory-unit-of-work";
import { makePot } from "src/server/domain/pot-collection/pot.factory";
import { Id } from "src/server/domain/shared/value-object/id";
import { Percentage } from "src/server/domain/shared/value-object/percentage";

describe("edit pot", () => {
  const userId = Id.generate().value;
  let potRepo: InMemoryPotRepository;
  let editPotService: EditPotService;
  let uow: InMemoryUnitOfWork;

  beforeEach(() => {
    potRepo = new InMemoryPotRepository({
      incomeRepository: new InMemoryIncomeRepository(),
      expenseRepository: new InMemoryExpenseRepository(),
    });
    uow = new InMemoryUnitOfWork();
    editPotService = new EditPotService({ potRepo, uow });
  });

  it("updates name of target pot", async () => {
    const pot = makePot({ percentage: new Percentage(60) });
    const other = makePot({ percentage: new Percentage(40) });
    potRepo.all().push(pot, other);

    await editPotService.execute({
      potId: pot.data.id.value,
      name: "Renamed",
      color: pot.data.color.value,
      userId,
    });

    const saved = potRepo.all().find((p) => p.data.id.isEqual(pot.data.id))!;
    expect(saved.data.name.value).toBe("Renamed");
  });

  it("updates color of target pot", async () => {
    const pot = makePot({ percentage: new Percentage(60) });
    const other = makePot({ percentage: new Percentage(40) });
    potRepo.all().push(pot, other);

    await editPotService.execute({
      potId: pot.data.id.value,
      name: pot.data.name.value,
      color: "#ff0000",
      userId,
    });

    const saved = potRepo.all().find((p) => p.data.id.isEqual(pot.data.id))!;
    expect(saved.data.color.value).toBe("#ff0000");
  });

  it("commits unit of work once", async () => {
    const pot = makePot({ percentage: new Percentage(60) });
    const other = makePot({ percentage: new Percentage(40) });
    potRepo.all().push(pot, other);

    const commitSpy = vi.spyOn(uow, "commit");
    await editPotService.execute({
      potId: pot.data.id.value,
      name: pot.data.name.value,
      color: pot.data.color.value,
      userId,
    });

    expect(commitSpy).toHaveBeenCalledTimes(1);
  });
});
