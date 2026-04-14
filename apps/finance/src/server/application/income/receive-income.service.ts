import { Income } from "@/server/domain/income/income";
import { IncomeRepository } from "@/server/domain/income/income.repository";
import { PotRepository } from "@/server/domain/pot-collection/pot.repository";
import { UnitOfWork } from "@/server/domain/shared/unit-of-work";
import { Datetime } from "@/server/domain/shared/value-object/datetime";
import { Id } from "@/server/domain/shared/value-object/id";
import { Money } from "@/server/domain/shared/value-object/money";
import { Name } from "@/server/domain/shared/value-object/name";
import { Tag } from "@/server/domain/tag/tag";

export type ReceiveIncomeCommand = {
  name: string;
  amount: number;
  tags: { id: string; name: string }[];
  userId: string;
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
    });
    await this.ctx.incomeRepo.save(income);
    await this.ctx.uow.commit();
    return { id: income.data.id.value };
  }
}
