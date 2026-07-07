import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Id } from "src/server/domain/shared/value-object/id";
import { Name } from "src/server/domain/shared/value-object/name";
import type { TagRepository } from "src/server/domain/tag/tag.repository";
import { TagNameConflictError } from "src/server/domain/tag/tag-name-conflict.error";

type EditTagCommand = { tagId: string; name: string; userId: string };

export class EditTagService {
  constructor(private ctx: { tagRepo: TagRepository; uow: UnitOfWork }) {}

  async execute(cmd: EditTagCommand): Promise<void> {
    const userId = new Id(cmd.userId);
    let id: Id;
    try {
      id = new Id(cmd.tagId);
    } catch {
      throw new Error("Tag not found");
    }
    const newName = new Name(cmd.name);

    const tag = await this.ctx.tagRepo.findById(id, userId);
    if (!tag) throw new Error("Tag not found");

    if (tag.data.name.value === newName.value) return;

    const exists = await this.ctx.tagRepo.existsByName(newName, userId);
    if (exists) throw new TagNameConflictError();

    tag.rename(newName);
    await this.ctx.tagRepo.save(tag);
    await this.ctx.uow.commit();
  }
}
