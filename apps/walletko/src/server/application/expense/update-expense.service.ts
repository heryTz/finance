import type { ExpenseRepository } from "src/server/domain/expense/expense.repository";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
import { Id } from "src/server/domain/shared/value-object/id";
import { Name } from "src/server/domain/shared/value-object/name";
import { Tag } from "src/server/domain/tag/tag";

export type UpdateExpenseCommand = {
  id: string;
  name: string;
  date: Date;
  tags: { id: string; name: string }[];
  userId: string;
};

export class UpdateExpenseService {
  constructor(
    private ctx: { expenseRepo: ExpenseRepository; uow: UnitOfWork },
  ) {}

  async execute(cmd: UpdateExpenseCommand) {
    const expense = await this.ctx.expenseRepo.findOne(
      new Id(cmd.id),
      new Id(cmd.userId),
    );
    if (!expense) throw new Error("Expense not found");

    const userId = new Id(cmd.userId);
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

    expense.update({
      name: new Name(cmd.name),
      date: new Datetime(cmd.date),
      tags,
    });
    await this.ctx.expenseRepo.update(expense);
    await this.ctx.uow.commit();
    return { id: expense.data.id.value };
  }
}
