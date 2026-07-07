import { Pot } from "src/server/domain/pot-collection/pot";
import type { PotRepository } from "src/server/domain/pot-collection/pot.repository";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Color } from "src/server/domain/shared/value-object/color";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
import { Id } from "src/server/domain/shared/value-object/id";
import { Name } from "src/server/domain/shared/value-object/name";
import { Percentage } from "src/server/domain/shared/value-object/percentage";

type ProvisionNewUserCommand = { userId: string };

export class ProvisionNewUserService {
  constructor(private ctx: { potRepo: PotRepository; uow: UnitOfWork }) {}

  async execute(cmd: ProvisionNewUserCommand): Promise<void> {
    const userId = new Id(cmd.userId);
    const pot = new Pot({
      id: Id.generate(),
      name: new Name("General"),
      percentage: new Percentage(100),
      color: new Color("#4fb8b2"),
      isDefault: true,
      userId,
      createdAt: Datetime.now(),
      updatedAt: null,
      archivedAt: null,
    });
    await this.ctx.potRepo.save(pot);
    await this.ctx.uow.commit();
  }
}
