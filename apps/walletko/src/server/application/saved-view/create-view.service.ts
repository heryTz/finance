import { SavedView } from "src/server/domain/saved-view/saved-view";
import type { SavedViewRepository } from "src/server/domain/saved-view/saved-view.repository";
import { SavedViewNameConflictError } from "src/server/domain/saved-view/saved-view-name-conflict.error";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
import { Id } from "src/server/domain/shared/value-object/id";
import { Name } from "src/server/domain/shared/value-object/name";

type CreateViewCommand = {
  name: string;
  description?: string;
  nameFilter?: string;
  tagIds?: string[];
  userId: string;
};

export class CreateViewService {
  constructor(
    private ctx: { viewRepo: SavedViewRepository; uow: UnitOfWork },
  ) {}

  async execute(cmd: CreateViewCommand): Promise<void> {
    const userId = new Id(cmd.userId);
    const name = new Name(cmd.name);
    const exists = await this.ctx.viewRepo.existsByName(name, userId);
    if (exists) throw new SavedViewNameConflictError();
    const view = new SavedView({
      id: Id.generate(),
      userId,
      name,
      description: cmd.description ?? null,
      nameFilter: cmd.nameFilter ?? null,
      tagIds: cmd.tagIds ?? [],
      createdAt: Datetime.now(),
      updatedAt: null,
    });
    await this.ctx.viewRepo.save(view);
    await this.ctx.uow.commit();
  }
}
