import { CancelExpenseService } from "src/server/application/expense/cancel-expense.service";
import { makeExpense } from "src/server/domain/expense/expense.factory";
import { makeExpenseAllocation } from "src/server/domain/expense/expense-allocation.factory";
import { makePot } from "src/server/domain/pot-collection/pot.factory";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
import { Id } from "src/server/domain/shared/value-object/id";
import { Money } from "src/server/domain/shared/value-object/money";
import { Name } from "src/server/domain/shared/value-object/name";
import { InMemoryExpenseCancellationRepository } from "src/server/infrastructure/expense/in-memory-expense-cancellation.repository";
import { InMemoryExpenseRepository } from "src/server/infrastructure/expense/in-memory-expense.repository";
import { InMemoryIncomeRepository } from "src/server/infrastructure/income/in-memory-income.repository";
import { InMemoryPotRepository } from "src/server/infrastructure/pot-collection/in-memory-pot.repository";
import { InMemoryUnitOfWork } from "src/server/infrastructure/shared/in-memory-unit-of-work";

describe("CancelExpenseService", () => {
  const userId = Id.generate().value;
  let expenseRepo: InMemoryExpenseRepository;
  let potRepo: InMemoryPotRepository;
  let cancellationRepo: InMemoryExpenseCancellationRepository;
  let uow: InMemoryUnitOfWork;
  let service: CancelExpenseService;

  beforeEach(() => {
    expenseRepo = new InMemoryExpenseRepository();
    potRepo = new InMemoryPotRepository({
      incomeRepository: new InMemoryIncomeRepository(),
      expenseRepository: expenseRepo,
    });
    cancellationRepo = new InMemoryExpenseCancellationRepository();
    uow = new InMemoryUnitOfWork();
    service = new CancelExpenseService({
      expenseRepo,
      potRepo,
      cancellationRepo,
      uow,
    });
  });

  it("throws when the expense does not exist", async () => {
    await expect(
      service.execute({ expenseId: Id.generate().value, userId }),
    ).rejects.toThrow("Expense not found");
  });

  it("cancels: marks the expense canceled, refunds each pot, commits", async () => {
    const defaultPot = makePot({ name: new Name("General"), isDefault: true });
    const potA = makePot({ name: new Name("Pot 1") });
    const potB = makePot({ name: new Name("Pot 2") });
    await potRepo.save(defaultPot);
    await potRepo.save(potA);
    await potRepo.save(potB);
    const expense = makeExpense({
      allocations: [
        makeExpenseAllocation({ potId: potA.data.id, amount: new Money(50) }),
        makeExpenseAllocation({ potId: potB.data.id, amount: new Money(25) }),
      ],
    });
    await expenseRepo.save(expense);
    const commitSpy = vi.spyOn(uow, "commit");

    await service.execute({ expenseId: expense.data.id.value, userId });

    expect(expenseRepo.canceled()).toContain(expense.data.id.value);
    expect(commitSpy).toHaveBeenCalledTimes(1);
    const saved = cancellationRepo.all();
    expect(saved).toHaveLength(1);
    expect(saved[0].data.cancelsTransactionId.value).toBe(
      expense.data.id.value,
    );
    const lines = saved[0].data.lines
      .map((l) => ({ potId: l.potId.value, amount: l.amount.rawCents }))
      .sort((a, b) => a.potId.localeCompare(b.potId));
    const expected = [
      { potId: potA.data.id.value, amount: 5000 },
      { potId: potB.data.id.value, amount: 2500 },
    ].sort((a, b) => a.potId.localeCompare(b.potId));
    expect(lines).toEqual(expected);
  });

  it("redirects an archived pot's refund to the default pot", async () => {
    const defaultPot = makePot({ name: new Name("General"), isDefault: true });
    const livePot = makePot({ name: new Name("Pot 1") });
    const deletedPot = makePot({
      name: new Name("Pot 2"),
      archivedAt: new Datetime("2026-02-01"),
    });
    await potRepo.save(defaultPot);
    await potRepo.save(livePot);
    await potRepo.save(deletedPot);
    const expense = makeExpense({
      allocations: [
        makeExpenseAllocation({
          potId: livePot.data.id,
          amount: new Money(50),
        }),
        makeExpenseAllocation({
          potId: deletedPot.data.id,
          amount: new Money(25),
        }),
      ],
    });
    await expenseRepo.save(expense);

    await service.execute({ expenseId: expense.data.id.value, userId });

    const lines = cancellationRepo.all()[0].data.lines.map((l) => ({
      potId: l.potId.value,
      amount: l.amount.rawCents,
    }));
    expect(lines).toContainEqual({
      potId: livePot.data.id.value,
      amount: 5000,
    });
    expect(lines).toContainEqual({
      potId: defaultPot.data.id.value,
      amount: 2500,
    });
    expect(lines).not.toContainEqual({
      potId: deletedPot.data.id.value,
      amount: 2500,
    });
  });

  it("merges refunds from multiple archived pots into a single default-pot line", async () => {
    const defaultPot = makePot({ name: new Name("General"), isDefault: true });
    const deletedA = makePot({
      name: new Name("Pot 1"),
      archivedAt: new Datetime("2026-02-01"),
    });
    const deletedB = makePot({
      name: new Name("Pot 2"),
      archivedAt: new Datetime("2026-02-01"),
    });
    await potRepo.save(defaultPot);
    await potRepo.save(deletedA);
    await potRepo.save(deletedB);
    const expense = makeExpense({
      allocations: [
        makeExpenseAllocation({
          potId: deletedA.data.id,
          amount: new Money(50),
        }),
        makeExpenseAllocation({
          potId: deletedB.data.id,
          amount: new Money(25),
        }),
      ],
    });
    await expenseRepo.save(expense);

    await service.execute({ expenseId: expense.data.id.value, userId });

    const lines = cancellationRepo.all()[0].data.lines.map((l) => ({
      potId: l.potId.value,
      amount: l.amount.rawCents,
    }));
    expect(lines).toEqual([{ potId: defaultPot.data.id.value, amount: 7500 }]);
  });
});
