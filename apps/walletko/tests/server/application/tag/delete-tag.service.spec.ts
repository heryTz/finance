import { DeleteTagService } from "src/server/application/tag/delete-tag.service";
import { InMemoryTagRepository } from "src/server/infrastructure/tag/in-memory-tag.repository";
import { InMemoryUnitOfWork } from "src/server/infrastructure/shared/in-memory-unit-of-work";
import { makeTag } from "src/server/domain/tag/tag.factory";
import { Id } from "src/server/domain/shared/value-object/id";

describe("DeleteTagService", () => {
  const userId = Id.generate().value;
  let repo: InMemoryTagRepository;
  let uow: InMemoryUnitOfWork;
  let service: DeleteTagService;

  beforeEach(() => {
    repo = new InMemoryTagRepository();
    uow = new InMemoryUnitOfWork();
    service = new DeleteTagService({ tagRepo: repo, uow });
  });

  it("removes the tag from the repository", async () => {
    const tag = makeTag({ userId });
    repo.all().push(tag);

    await service.execute({ tagId: tag.data.id.value, userId });

    expect(repo.all()).toHaveLength(0);
  });

  it("commits the unit of work", async () => {
    const tag = makeTag({ userId });
    repo.all().push(tag);
    const commitSpy = vi.spyOn(uow, "commit");

    await service.execute({ tagId: tag.data.id.value, userId });

    expect(commitSpy).toHaveBeenCalledTimes(1);
  });
});
