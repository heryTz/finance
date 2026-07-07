import { ExpenseCancellation } from "src/server/domain/expense/expense-cancellation";
import type { ExpenseCancellationRepository } from "src/server/domain/expense/expense-cancellation.repository";
import type { ExpenseRepository } from "src/server/domain/expense/expense.repository";
import type { PotRepository } from "src/server/domain/pot-collection/pot.repository";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Id } from "src/server/domain/shared/value-object/id";

export type CancelExpenseCommand = {
  expenseId: string;
  userId: string;
};

export class CancelExpenseService {
  constructor(
    private ctx: {
      expenseRepo: ExpenseRepository;
      potRepo: PotRepository;
      cancellationRepo: ExpenseCancellationRepository;
      uow: UnitOfWork;
    },
  ) {}

  async execute(cmd: CancelExpenseCommand): Promise<void> {
    const expenseId = new Id(cmd.expenseId);
    const userId = new Id(cmd.userId);

    const expense = await this.ctx.expenseRepo.findOne(expenseId, userId);
    if (!expense) throw new Error("Expense not found");

    const pots = await this.ctx.potRepo.findAllWithArchived(userId);
    const defaultPot = pots.find((p) => p.data.isDefault);
    if (!defaultPot) throw new Error("Default pot not found");

    const resolvePotId = (potId: Id): Id => {
      const pot = pots.find((p) => p.data.id.isEqual(potId));
      return pot && pot.data.archivedAt === null ? potId : defaultPot.data.id;
    };

    const cancellation = ExpenseCancellation.fromExpense(expense, resolvePotId);
    await this.ctx.expenseRepo.markCanceled(expenseId, userId);
    await this.ctx.cancellationRepo.save(cancellation);
    await this.ctx.uow.commit();
  }
}
