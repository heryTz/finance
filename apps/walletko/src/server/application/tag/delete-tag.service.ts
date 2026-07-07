import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Id } from "src/server/domain/shared/value-object/id";
import type { TagRepository } from "src/server/domain/tag/tag.repository";

type DeleteTagCommand = { tagId: string; userId: string };

export class DeleteTagService {
  constructor(private ctx: { tagRepo: TagRepository; uow: UnitOfWork }) {}

  async execute(cmd: DeleteTagCommand): Promise<void> {
    await this.ctx.tagRepo.remove(new Id(cmd.tagId), new Id(cmd.userId));
    await this.ctx.uow.commit();
  }
}
