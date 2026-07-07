import type { SavedViewRepository } from "src/server/domain/saved-view/saved-view.repository";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Id } from "src/server/domain/shared/value-object/id";

type DeleteViewCommand = { viewId: string; userId: string };

export class DeleteViewService {
  constructor(
    private ctx: { viewRepo: SavedViewRepository; uow: UnitOfWork },
  ) {}

  async execute(cmd: DeleteViewCommand): Promise<void> {
    await this.ctx.viewRepo.remove(new Id(cmd.viewId), new Id(cmd.userId));
    await this.ctx.uow.commit();
  }
}
