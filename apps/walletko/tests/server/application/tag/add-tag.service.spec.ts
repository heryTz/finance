import { AddTagService } from "src/server/application/tag/add-tag.service";
import { InMemoryTagRepository } from "src/server/infrastructure/tag/in-memory-tag.repository";
import { InMemoryUnitOfWork } from "src/server/infrastructure/shared/in-memory-unit-of-work";
import { TagNameConflictError } from "src/server/domain/tag/tag-name-conflict.error";
import { makeTag } from "src/server/domain/tag/tag.factory";
import { Id } from "src/server/domain/shared/value-object/id";

describe("AddTagService", () => {
  const userId = Id.generate().value;
  let repo: InMemoryTagRepository;
  let uow: InMemoryUnitOfWork;
  let service: AddTagService;

  beforeEach(() => {
    repo = new InMemoryTagRepository();
    uow = new InMemoryUnitOfWork();
    service = new AddTagService({ tagRepo: repo, uow });
  });

  it("saves a tag with the given name and userId", async () => {
    await service.execute({ name: "groceries", userId });

    const [saved] = repo.all();
    expect(saved.data.name.value).toBe("groceries");
    expect(saved.data.userId.value).toBe(userId);
  });

  it("throws TagNameConflictError when a tag with the same name already exists", async () => {
    repo.all().push(makeTag({ name: "groceries", userId }));

    await expect(
      service.execute({ name: "groceries", userId }),
    ).rejects.toThrow(TagNameConflictError);
  });

  it("commits the unit of work", async () => {
    const commitSpy = vi.spyOn(uow, "commit");
    await service.execute({ name: "groceries", userId });
    expect(commitSpy).toHaveBeenCalledTimes(1);
  });
});
