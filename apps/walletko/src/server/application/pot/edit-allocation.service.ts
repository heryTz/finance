import type { PotRepository } from "src/server/domain/pot-collection/pot.repository";
import { PotCollection } from "src/server/domain/pot-collection/pot-collection";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Id } from "src/server/domain/shared/value-object/id";
import { Percentage } from "src/server/domain/shared/value-object/percentage";

type EditAllocationCommand = {
  allPots: { id: string; percentage: number }[];
  userId: string;
};

export class EditAllocationService {
  constructor(
    private ctx: {
      potRepo: PotRepository;
      uow: UnitOfWork;
    },
  ) {}

  async execute(cmd: EditAllocationCommand) {
    const userId = new Id(cmd.userId);
    const pots = await this.ctx.potRepo.findAll(userId);
    const potCollection = new PotCollection({ pots });

    potCollection.adjustRepartition(
      cmd.allPots.map((p) => ({
        id: new Id(p.id),
        percentage: new Percentage(p.percentage),
      })),
    );

    for (const pot of potCollection.potsData) {
      await this.ctx.potRepo.save(pot);
    }
    await this.ctx.uow.commit();
  }
}
