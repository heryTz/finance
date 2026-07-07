import { DeleteViewService } from "src/server/application/saved-view/delete-view.service";
import { InMemorySavedViewRepository } from "src/server/infrastructure/saved-view/in-memory-saved-view.repository";
import { InMemoryUnitOfWork } from "src/server/infrastructure/shared/in-memory-unit-of-work";
import { makeSavedView } from "src/server/domain/saved-view/saved-view.factory";
import { Id } from "src/server/domain/shared/value-object/id";

describe("DeleteViewService", () => {
  const userId = Id.generate().value;
  let repo: InMemorySavedViewRepository;
  let uow: InMemoryUnitOfWork;
  let service: DeleteViewService;

  beforeEach(() => {
    repo = new InMemorySavedViewRepository();
    uow = new InMemoryUnitOfWork();
    service = new DeleteViewService({ viewRepo: repo, uow });
  });

  it("removes the view from the repository", async () => {
    const view = makeSavedView({ name: "YouTube", userId });
    await repo.save(view);

    await service.execute({ viewId: view.data.id.value, userId });

    expect(repo.all()).toHaveLength(0);
  });

  it("does not remove views belonging to other users", async () => {
    const otherUserId = Id.generate().value;
    const view = makeSavedView({ name: "YouTube", userId: otherUserId });
    await repo.save(view);

    await service.execute({ viewId: view.data.id.value, userId });

    expect(repo.all()).toHaveLength(1);
  });

  it("commits the unit of work", async () => {
    const view = makeSavedView({ name: "YouTube", userId });
    await repo.save(view);
    const commitSpy = vi.spyOn(uow, "commit");

    await service.execute({ viewId: view.data.id.value, userId });

    expect(commitSpy).toHaveBeenCalledTimes(1);
  });
});
