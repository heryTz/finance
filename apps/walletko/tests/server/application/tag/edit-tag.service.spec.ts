import { EditTagService } from "src/server/application/tag/edit-tag.service";
import { InMemoryTagRepository } from "src/server/infrastructure/tag/in-memory-tag.repository";
import { InMemoryUnitOfWork } from "src/server/infrastructure/shared/in-memory-unit-of-work";
import { TagNameConflictError } from "src/server/domain/tag/tag-name-conflict.error";
import { makeTag } from "src/server/domain/tag/tag.factory";
import { Id } from "src/server/domain/shared/value-object/id";

describe("EditTagService", () => {
  const userId = Id.generate().value;
  let repo: InMemoryTagRepository;
  let uow: InMemoryUnitOfWork;
  let service: EditTagService;

  beforeEach(() => {
    repo = new InMemoryTagRepository();
    uow = new InMemoryUnitOfWork();
    service = new EditTagService({ tagRepo: repo, uow });
  });

  it("renames the tag", async () => {
    const tag = makeTag({ name: "groceries", userId });
    repo.all().push(tag);

    await service.execute({ tagId: tag.data.id.value, name: "food", userId });

    const updated = repo.all()[0];
    expect(updated.data.name.value).toBe("food");
  });

  it("throws when the tag is not found", async () => {
    await expect(
      service.execute({ tagId: "non-existent", name: "food", userId }),
    ).rejects.toThrow("Tag not found");
  });

  it("throws TagNameConflictError when the new name belongs to another tag", async () => {
    const tag = makeTag({ name: "groceries", userId });
    const other = makeTag({ name: "food", userId });
    repo.all().push(tag, other);

    await expect(
      service.execute({ tagId: tag.data.id.value, name: "food", userId }),
    ).rejects.toThrow(TagNameConflictError);
  });

  it("does nothing when the name is unchanged", async () => {
    const tag = makeTag({ name: "groceries", userId });
    repo.all().push(tag);
    const commitSpy = vi.spyOn(uow, "commit");

    await service.execute({
      tagId: tag.data.id.value,
      name: "groceries",
      userId,
    });

    expect(commitSpy).not.toHaveBeenCalled();
  });

  it("commits the unit of work", async () => {
    const tag = makeTag({ name: "groceries", userId });
    repo.all().push(tag);
    const commitSpy = vi.spyOn(uow, "commit");

    await service.execute({ tagId: tag.data.id.value, name: "food", userId });

    expect(commitSpy).toHaveBeenCalledTimes(1);
  });
});
