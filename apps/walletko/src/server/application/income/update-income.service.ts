import type { IncomeRepository } from "src/server/domain/income/income.repository";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
import { Id } from "src/server/domain/shared/value-object/id";
import { Name } from "src/server/domain/shared/value-object/name";
import { Tag } from "src/server/domain/tag/tag";

export type UpdateIncomeCommand = {
  id: string;
  name: string;
  date: Date;
  tags: { id: string; name: string }[];
  userId: string;
};

export class UpdateIncomeService {
  constructor(private ctx: { incomeRepo: IncomeRepository; uow: UnitOfWork }) {}

  async execute(cmd: UpdateIncomeCommand) {
    const income = await this.ctx.incomeRepo.findOne(
      new Id(cmd.id),
      new Id(cmd.userId),
    );
    if (!income) throw new Error("Income not found");

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

    income.update({
      name: new Name(cmd.name),
      date: new Datetime(cmd.date),
      tags,
    });
    await this.ctx.incomeRepo.update(income);
    await this.ctx.uow.commit();
    return { id: income.data.id.value };
  }
}
