import type { SavedViewRepository } from "src/server/domain/saved-view/saved-view.repository";
import { SavedViewNameConflictError } from "src/server/domain/saved-view/saved-view-name-conflict.error";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Id } from "src/server/domain/shared/value-object/id";
import { Name } from "src/server/domain/shared/value-object/name";

type UpdateViewCommand = {
  viewId: string;
  name: string;
  description?: string;
  nameFilter?: string;
  tagIds?: string[];
  userId: string;
};

export class UpdateViewService {
  constructor(
    private ctx: { viewRepo: SavedViewRepository; uow: UnitOfWork },
  ) {}

  async execute(cmd: UpdateViewCommand): Promise<void> {
    const userId = new Id(cmd.userId);
    const id = new Id(cmd.viewId);
    const view = await this.ctx.viewRepo.findById(id, userId);
    if (!view) throw new Error("View not found");

    const name = new Name(cmd.name);
    if (view.data.name.value !== name.value) {
      const exists = await this.ctx.viewRepo.existsByName(name, userId);
      if (exists) throw new SavedViewNameConflictError();
    }

    view.update({
      name,
      description: cmd.description ?? null,
      nameFilter: cmd.nameFilter ?? null,
      tagIds: cmd.tagIds ?? [],
    });
    await this.ctx.viewRepo.save(view);
    await this.ctx.uow.commit();
  }
}
