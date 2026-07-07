import { Expense } from "src/server/domain/expense/expense";
import type { ExpenseRepository } from "src/server/domain/expense/expense.repository";
import type { PotRepository } from "src/server/domain/pot-collection/pot.repository";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
import { Id } from "src/server/domain/shared/value-object/id";
import { Money } from "src/server/domain/shared/value-object/money";
import { Name } from "src/server/domain/shared/value-object/name";
import { Tag } from "src/server/domain/tag/tag";

type PayExpenseCommand = {
  name: string;
  tags: { id: string; name: string }[];
  drawFrom: { potId: string; amount: number }[];
  userId: string;
  createdAt?: Date;
};

export class PayExpenseService {
  constructor(
    private ctx: {
      uow: UnitOfWork;
      potRepo: PotRepository;
      expenseRepo: ExpenseRepository;
    },
  ) {}

  async execute(cmd: PayExpenseCommand) {
    if (!cmd.drawFrom.length) {
      throw new Error("Expense requires at least one pot to draw from");
    }
    const userId = new Id(cmd.userId);
    const pots = await this.ctx.potRepo.findSnapshot(userId);
    const tags = cmd.tags.map(
      (el) =>
        new Tag({
          id: new Id(el.id),
          name: new Name(el.name),
          userId,
          createdAt: Datetime.now(),
          updatedAt: null,
        }),
    );
    const expense = Expense.create({
      name: new Name(cmd.name),
      selectedPots: cmd.drawFrom.map((el) => ({
        id: new Id(el.potId),
        amount: new Money(el.amount),
      })),
      tags,
      pots,
      userId,
      createdAt: cmd.createdAt ? new Datetime(cmd.createdAt) : undefined,
    });
    await this.ctx.expenseRepo.save(expense);
    await this.ctx.uow.commit();
    return { id: expense.data.id.value };
  }
}
