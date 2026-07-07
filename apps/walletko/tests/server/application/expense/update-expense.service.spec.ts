import { InMemoryExpenseRepository } from "src/server/infrastructure/expense/in-memory-expense.repository";
import { InMemoryUnitOfWork } from "src/server/infrastructure/shared/in-memory-unit-of-work";
import { UpdateExpenseService } from "src/server/application/expense/update-expense.service";
import { makeExpense } from "src/server/domain/expense/expense.factory";
import { Id } from "src/server/domain/shared/value-object/id";

describe("update expense", () => {
  const userId = Id.generate().value;
  let expenseRepo: InMemoryExpenseRepository;
  let uow: InMemoryUnitOfWork;
  let updateExpense: UpdateExpenseService;

  beforeEach(() => {
    expenseRepo = new InMemoryExpenseRepository();
    uow = new InMemoryUnitOfWork();
    updateExpense = new UpdateExpenseService({ expenseRepo, uow });

    const existing = makeExpense({ userId: new Id(userId) });
    expenseRepo.all().push(existing);
  });

  it("updates name, date, and tags on the stored expense", async () => {
    const stored = expenseRepo.all()[0];
    const newDate = new Date("2025-06-01");

    await updateExpense.execute({
      id: stored.data.id.value,
      name: "Updated Name",
      date: newDate,
      tags: [{ id: Id.generate().value, name: "food" }],
      userId,
    });

    const updated = expenseRepo.all()[0];
    expect(updated.data.name.value).toBe("Updated Name");
    expect(updated.data.createdAt.value).toEqual(newDate);
    expect(updated.data.tags.length).toBe(1);
    expect(updated.data.tags[0].data.name.value).toBe("food");
  });

  it("does not change amount", async () => {
    const stored = expenseRepo.all()[0];
    const originalAmount = stored.data.amount.value;

    await updateExpense.execute({
      id: stored.data.id.value,
      name: "Updated",
      date: new Date(),
      tags: [],
      userId,
    });

    const updated = expenseRepo.all()[0];
    expect(updated.data.amount.value).toBe(originalAmount);
  });

  it("throws when expense not found", async () => {
    await expect(
      updateExpense.execute({
        id: Id.generate().value,
        name: "Ghost",
        date: new Date(),
        tags: [],
        userId,
      }),
    ).rejects.toThrow("Expense not found");
  });

  it("commits unit of work", async () => {
    const stored = expenseRepo.all()[0];
    const commitSpy = vi.spyOn(uow, "commit");

    await updateExpense.execute({
      id: stored.data.id.value,
      name: "Updated",
      date: new Date(),
      tags: [],
      userId,
    });

    expect(commitSpy).toHaveBeenCalledTimes(1);
  });
});
