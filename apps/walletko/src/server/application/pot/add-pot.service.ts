import type { PotRepository } from "src/server/domain/pot-collection/pot.repository";
import { PotCollection } from "src/server/domain/pot-collection/pot-collection";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Color } from "src/server/domain/shared/value-object/color";
import { Id } from "src/server/domain/shared/value-object/id";
import { Name } from "src/server/domain/shared/value-object/name";
import { Percentage } from "src/server/domain/shared/value-object/percentage";

type AddPotCommand = {
  name: string;
  percentage: number;
  color: string;
  otherPots: { id: string; percentage: number }[];
  userId: string;
};

export class AddPotService {
  constructor(
    private ctx: {
      potRepo: PotRepository;
      uow: UnitOfWork;
    },
  ) {}

  async execute(cmd: AddPotCommand) {
    const userId = new Id(cmd.userId);
    const pots = await this.ctx.potRepo.findAll(userId);
    const potCollection = new PotCollection({ pots });
    const newPot = potCollection.addPot(
      new Name(cmd.name),
      new Percentage(cmd.percentage),
      new Color(cmd.color),
      cmd.otherPots.map((p) => ({
        id: new Id(p.id),
        percentage: new Percentage(p.percentage),
      })),
      userId,
    );
    for (const pot of potCollection.potsData) {
      await this.ctx.potRepo.save(pot);
    }
    await this.ctx.uow.commit();
    return { id: newPot.data.id.value };
  }
}
