import { Income } from "src/server/domain/income/income";
import type { IncomeRepository } from "src/server/domain/income/income.repository";
import type { PotRepository } from "src/server/domain/pot-collection/pot.repository";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
import { Id } from "src/server/domain/shared/value-object/id";
import { Money } from "src/server/domain/shared/value-object/money";
import { Name } from "src/server/domain/shared/value-object/name";
import { Tag } from "src/server/domain/tag/tag";

export type ReceiveIncomeCommand = {
  name: string;
  amount: number;
  tags: { id: string; name: string }[];
  userId: string;
  createdAt?: Date;
};

export class ReceiveIncomeService {
  constructor(
    private ctx: {
      incomeRepo: IncomeRepository;
      uow: UnitOfWork;
      potRepo: PotRepository;
    },
  ) {}

  async execute(cmd: ReceiveIncomeCommand) {
    const userId = new Id(cmd.userId);
    const pots = await this.ctx.potRepo.findAll(userId);
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
    const income = Income.create({
      name: new Name(cmd.name),
      amount: new Money(cmd.amount),
      tags,
      pots,
      userId,
      createdAt: cmd.createdAt ? new Datetime(cmd.createdAt) : undefined,
    });
    await this.ctx.incomeRepo.save(income);
    await this.ctx.uow.commit();
    return { id: income.data.id.value };
  }
}
