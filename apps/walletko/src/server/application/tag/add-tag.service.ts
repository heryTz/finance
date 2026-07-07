import { createId } from "@paralleldrive/cuid2";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
import { Id } from "src/server/domain/shared/value-object/id";
import { Name } from "src/server/domain/shared/value-object/name";
import { Tag } from "src/server/domain/tag/tag";
import type { TagRepository } from "src/server/domain/tag/tag.repository";
import { TagNameConflictError } from "src/server/domain/tag/tag-name-conflict.error";

type AddTagCommand = { name: string; userId: string };

export class AddTagService {
  constructor(private ctx: { tagRepo: TagRepository; uow: UnitOfWork }) {}

  async execute(cmd: AddTagCommand): Promise<void> {
    const userId = new Id(cmd.userId);
    const name = new Name(cmd.name);
    const exists = await this.ctx.tagRepo.existsByName(name, userId);
    if (exists) throw new TagNameConflictError();
    const tag = new Tag({
      id: new Id(createId()),
      name,
      userId,
      createdAt: Datetime.now(),
      updatedAt: null,
    });
    await this.ctx.tagRepo.save(tag);
    await this.ctx.uow.commit();
  }
}
