import type { PotRepository } from "src/server/domain/pot-collection/pot.repository";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Color } from "src/server/domain/shared/value-object/color";
import { Id } from "src/server/domain/shared/value-object/id";
import { Name } from "src/server/domain/shared/value-object/name";

type EditPotCommand = {
  potId: string;
  name: string;
  color: string;
  userId: string;
};

export class EditPotService {
  constructor(
    private ctx: {
      potRepo: PotRepository;
      uow: UnitOfWork;
    },
  ) {}

  async execute(cmd: EditPotCommand) {
    const userId = new Id(cmd.userId);
    const pots = await this.ctx.potRepo.findAll(userId);

    const targetPot = pots.find((p) => p.data.id.isEqual(new Id(cmd.potId)));
    if (!targetPot) throw new Error("Pot not found");

    targetPot.changeName(new Name(cmd.name));
    targetPot.changeColor(new Color(cmd.color));

    await this.ctx.potRepo.save(targetPot);
    await this.ctx.uow.commit();
  }
}
