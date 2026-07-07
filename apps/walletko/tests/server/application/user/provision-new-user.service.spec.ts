import { ProvisionNewUserService } from "src/server/application/user/provision-new-user.service";
import { InMemoryPotRepository } from "src/server/infrastructure/pot-collection/in-memory-pot.repository";
import { InMemoryIncomeRepository } from "src/server/infrastructure/income/in-memory-income.repository";
import { InMemoryExpenseRepository } from "src/server/infrastructure/expense/in-memory-expense.repository";
import { InMemoryUnitOfWork } from "src/server/infrastructure/shared/in-memory-unit-of-work";
import { Id } from "src/server/domain/shared/value-object/id";

describe("provision new user", () => {
  const userId = Id.generate().value;
  let potRepo: InMemoryPotRepository;
  let uow: InMemoryUnitOfWork;
  let service: ProvisionNewUserService;

  beforeEach(() => {
    potRepo = new InMemoryPotRepository({
      incomeRepository: new InMemoryIncomeRepository(),
      expenseRepository: new InMemoryExpenseRepository(),
    });
    uow = new InMemoryUnitOfWork();
    service = new ProvisionNewUserService({ potRepo, uow });
  });

  it("creates a default General pot at 100%", async () => {
    await service.execute({ userId });
    const pots = potRepo.all();
    expect(pots).toHaveLength(1);
    expect(pots[0].data.name.value).toBe("General");
    expect(pots[0].data.percentage.value).toBe(100);
    expect(pots[0].data.userId.value).toBe(userId);
    expect(pots[0].data.isDefault).toBe(true);
    expect(pots[0].data.color.value).toBe("#4fb8b2");
  });

  it("commits the unit of work", async () => {
    const commitSpy = vi.spyOn(uow, "commit");
    await service.execute({ userId });
    expect(commitSpy).toHaveBeenCalledTimes(1);
  });

  it("propagates error from potRepo.save", async () => {
    const error = new Error("db failure");
    const commitSpy = vi.spyOn(uow, "commit");
    vi.spyOn(potRepo, "save").mockRejectedValue(error);
    await expect(service.execute({ userId })).rejects.toThrow("db failure");
    expect(commitSpy).not.toHaveBeenCalled();
  });
});
