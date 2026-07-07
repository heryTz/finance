import { CancelIncomeService } from "src/server/application/income/cancel-income.service";
import { CancelIncomeBlockedError } from "src/server/domain/income/cancel-income-blocked.error";
import { makeIncome } from "src/server/domain/income/income.factory";
import { makePotAllocation } from "src/server/domain/income/pot-allocation.factory";
import {
  makePot,
  makePotSnapshot,
} from "src/server/domain/pot-collection/pot.factory";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
import { Id } from "src/server/domain/shared/value-object/id";
import { Money } from "src/server/domain/shared/value-object/money";
import { Name } from "src/server/domain/shared/value-object/name";
import { InMemoryExpenseRepository } from "src/server/infrastructure/expense/in-memory-expense.repository";
import { InMemoryIncomeCancellationRepository } from "src/server/infrastructure/income/in-memory-income-cancellation.repository";
import { InMemoryIncomeRepository } from "src/server/infrastructure/income/in-memory-income.repository";
import { InMemoryPotRepository } from "src/server/infrastructure/pot-collection/in-memory-pot.repository";
import { InMemoryUnitOfWork } from "src/server/infrastructure/shared/in-memory-unit-of-work";

describe("CancelIncomeService", () => {
  const userId = Id.generate().value;
  let incomeRepo: InMemoryIncomeRepository;
  let potRepo: InMemoryPotRepository;
  let cancellationRepo: InMemoryIncomeCancellationRepository;
  let uow: InMemoryUnitOfWork;
  let service: CancelIncomeService;

  beforeEach(() => {
    incomeRepo = new InMemoryIncomeRepository();
    potRepo = new InMemoryPotRepository({
      incomeRepository: incomeRepo,
      expenseRepository: new InMemoryExpenseRepository(),
    });
    cancellationRepo = new InMemoryIncomeCancellationRepository();
    uow = new InMemoryUnitOfWork();
    service = new CancelIncomeService({
      incomeRepo,
      potRepo,
      cancellationRepo,
      uow,
    });
  });

  it("throws when the income does not exist", async () => {
    await expect(
      service.execute({ incomeId: Id.generate().value, userId }),
    ).rejects.toThrow("Income not found");
  });

  it("cancels: marks the income canceled, records a take-back per pot, commits", async () => {
    const potA = makePot({ name: new Name("Pot 1") });
    const potB = makePot({ name: new Name("Pot 2") });
    const income = makeIncome({
      allocations: [
        makePotAllocation({ potId: potA.data.id, amount: new Money(50) }),
        makePotAllocation({ potId: potB.data.id, amount: new Money(25) }),
      ],
    });
    await incomeRepo.save(income);
    vi.spyOn(potRepo, "findSnapshot").mockResolvedValue([
      makePotSnapshot({ pot: potA, balance: new Money(50) }),
      makePotSnapshot({ pot: potB, balance: new Money(25) }),
    ]);
    const commitSpy = vi.spyOn(uow, "commit");

    await service.execute({ incomeId: income.data.id.value, userId });

    expect(incomeRepo.canceled()).toContain(income.data.id.value);
    expect(commitSpy).toHaveBeenCalledTimes(1);
    const saved = cancellationRepo.all();
    expect(saved).toHaveLength(1);
    expect(saved[0].data.cancelsTransactionId.value).toBe(income.data.id.value);
    const lines = saved[0].data.lines
      .map((l) => ({ potId: l.potId.value, amount: l.amount.rawCents }))
      .sort((a, b) => a.potId.localeCompare(b.potId));
    const expected = [
      { potId: potA.data.id.value, amount: 5000 },
      { potId: potB.data.id.value, amount: 2500 },
    ].sort((a, b) => a.potId.localeCompare(b.potId));
    expect(lines).toEqual(expected);
  });

  it("allows cancellation at the exact floor (balance equals allocation)", async () => {
    const pot = makePot({});
    const income = makeIncome({
      allocations: [
        makePotAllocation({ potId: pot.data.id, amount: new Money(50) }),
      ],
    });
    await incomeRepo.save(income);
    vi.spyOn(potRepo, "findSnapshot").mockResolvedValue([
      makePotSnapshot({ pot, balance: new Money(50) }),
    ]);

    await service.execute({ incomeId: income.data.id.value, userId });

    expect(incomeRepo.canceled()).toContain(income.data.id.value);
  });

  it("blocks when a live pot was spent below its allocation", async () => {
    const pot = makePot({ name: new Name("Groceries") });
    const income = makeIncome({
      allocations: [
        makePotAllocation({ potId: pot.data.id, amount: new Money(50) }),
      ],
    });
    await incomeRepo.save(income);
    vi.spyOn(potRepo, "findSnapshot").mockResolvedValue([
      makePotSnapshot({ pot, balance: Money.fromCents(800) }),
    ]);

    const promise = service.execute({ incomeId: income.data.id.value, userId });
    await expect(promise).rejects.toBeInstanceOf(CancelIncomeBlockedError);
    await expect(promise).rejects.toMatchObject({
      pots: [{ name: "Groceries", shortfall: 4200 }],
    });
    expect(incomeRepo.canceled()).toHaveLength(0);
    expect(cancellationRepo.all()).toHaveLength(0);
  });

  it("blocks when a funded pot has been archived", async () => {
    const livePot = makePot({ name: new Name("Pot 1") });
    const deletedPot = makePot({
      name: new Name("Pot 2"),
      archivedAt: new Datetime("2026-02-01"),
    });
    await potRepo.save(deletedPot);
    const income = makeIncome({
      allocations: [
        makePotAllocation({ potId: livePot.data.id, amount: new Money(50) }),
        makePotAllocation({ potId: deletedPot.data.id, amount: new Money(25) }),
      ],
    });
    await incomeRepo.save(income);
    vi.spyOn(potRepo, "findSnapshot").mockResolvedValue([
      makePotSnapshot({ pot: livePot, balance: new Money(50) }),
    ]);

    const promise = service.execute({ incomeId: income.data.id.value, userId });
    await expect(promise).rejects.toBeInstanceOf(CancelIncomeBlockedError);
    await expect(promise).rejects.toMatchObject({
      pots: [{ name: "Pot 2", shortfall: 2500 }],
    });
    expect(incomeRepo.canceled()).toHaveLength(0);
  });
});
