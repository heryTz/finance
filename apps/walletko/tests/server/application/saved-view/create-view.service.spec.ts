import { CreateViewService } from "src/server/application/saved-view/create-view.service";
import { InMemorySavedViewRepository } from "src/server/infrastructure/saved-view/in-memory-saved-view.repository";
import { InMemoryUnitOfWork } from "src/server/infrastructure/shared/in-memory-unit-of-work";
import { SavedViewNameConflictError } from "src/server/domain/saved-view/saved-view-name-conflict.error";
import { makeSavedView } from "src/server/domain/saved-view/saved-view.factory";
import { Id } from "src/server/domain/shared/value-object/id";

describe("CreateViewService", () => {
  const userId = Id.generate().value;
  let repo: InMemorySavedViewRepository;
  let uow: InMemoryUnitOfWork;
  let service: CreateViewService;

  beforeEach(() => {
    repo = new InMemorySavedViewRepository();
    uow = new InMemoryUnitOfWork();
    service = new CreateViewService({ viewRepo: repo, uow });
  });

  it("saves a view with the given name and userId", async () => {
    await service.execute({ name: "YouTube", nameFilter: "youtube", userId });

    const [saved] = repo.all();
    expect(saved.data.name.value).toBe("YouTube");
    expect(saved.data.userId.value).toBe(userId);
    expect(saved.data.nameFilter).toBe("youtube");
    expect(saved.data.tagIds).toEqual([]);
  });

  it("saves description and tagIds when provided", async () => {
    const tagId = Id.generate().value;
    await service.execute({
      name: "Loan John",
      description: "Money I lent to John",
      tagIds: [tagId],
      userId,
    });

    const [saved] = repo.all();
    expect(saved.data.description).toBe("Money I lent to John");
    expect(saved.data.tagIds).toEqual([tagId]);
  });

  it("throws SavedViewNameConflictError when a view with the same name already exists", async () => {
    await repo.save(makeSavedView({ name: "YouTube", userId }));

    await expect(
      service.execute({ name: "YouTube", nameFilter: "youtube", userId }),
    ).rejects.toThrow(SavedViewNameConflictError);
  });

  it("commits the unit of work", async () => {
    const commitSpy = vi.spyOn(uow, "commit");
    await service.execute({ name: "YouTube", nameFilter: "youtube", userId });
    expect(commitSpy).toHaveBeenCalledTimes(1);
  });
});
