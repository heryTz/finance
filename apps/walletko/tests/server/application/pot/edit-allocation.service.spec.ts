import { EditAllocationService } from "src/server/application/pot/edit-allocation.service";
import { InMemoryExpenseRepository } from "src/server/infrastructure/expense/in-memory-expense.repository";
import { InMemoryIncomeRepository } from "src/server/infrastructure/income/in-memory-income.repository";
import { InMemoryPotRepository } from "src/server/infrastructure/pot-collection/in-memory-pot.repository";
import { InMemoryUnitOfWork } from "src/server/infrastructure/shared/in-memory-unit-of-work";
import { makePot } from "src/server/domain/pot-collection/pot.factory";
import { Id } from "src/server/domain/shared/value-object/id";
import { Percentage } from "src/server/domain/shared/value-object/percentage";

describe("edit allocation", () => {
  const userId = Id.generate().value;
  let potRepo: InMemoryPotRepository;
  let editAllocationService: EditAllocationService;
  let uow: InMemoryUnitOfWork;

  beforeEach(() => {
    potRepo = new InMemoryPotRepository({
      incomeRepository: new InMemoryIncomeRepository(),
      expenseRepository: new InMemoryExpenseRepository(),
    });
    uow = new InMemoryUnitOfWork();
    editAllocationService = new EditAllocationService({ potRepo, uow });
  });

  it("redistributes percentages across all pots", async () => {
    const pot = makePot({ percentage: new Percentage(60) });
    const other = makePot({ percentage: new Percentage(40) });
    potRepo.all().push(pot, other);

    await editAllocationService.execute({
      allPots: [
        { id: pot.data.id.value, percentage: 70 },
        { id: other.data.id.value, percentage: 30 },
      ],
      userId,
    });

    const savedPot = potRepo.all().find((p) => p.data.id.isEqual(pot.data.id))!;
    const savedOther = potRepo
      .all()
      .find((p) => p.data.id.isEqual(other.data.id))!;
    expect(savedPot.data.percentage.value).toBe(70);
    expect(savedOther.data.percentage.value).toBe(30);
  });

  it("commits unit of work once", async () => {
    const pot = makePot({ percentage: new Percentage(60) });
    const other = makePot({ percentage: new Percentage(40) });
    potRepo.all().push(pot, other);

    const commitSpy = vi.spyOn(uow, "commit");
    await editAllocationService.execute({
      allPots: [
        { id: pot.data.id.value, percentage: 60 },
        { id: other.data.id.value, percentage: 40 },
      ],
      userId,
    });

    expect(commitSpy).toHaveBeenCalledTimes(1);
  });
});
