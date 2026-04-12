import { PotCollection } from "@/server/domain/pot-collection/pot-collection";
import { PotRepository } from "@/server/domain/pot-collection/pot.repository";
import { UnitOfWork } from "@/server/domain/shared/unit-of-work";
import { Id } from "@/server/domain/shared/value-object/id";
import { Name } from "@/server/domain/shared/value-object/name";
import { Percentage } from "@/server/domain/shared/value-object/percentage";

type AddPotCommand = {
  name: string;
  percentage: number;
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
