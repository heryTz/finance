import { UpdateViewService } from "src/server/application/saved-view/update-view.service";
import { InMemorySavedViewRepository } from "src/server/infrastructure/saved-view/in-memory-saved-view.repository";
import { InMemoryUnitOfWork } from "src/server/infrastructure/shared/in-memory-unit-of-work";
import { SavedViewNameConflictError } from "src/server/domain/saved-view/saved-view-name-conflict.error";
import { makeSavedView } from "src/server/domain/saved-view/saved-view.factory";
import { Id } from "src/server/domain/shared/value-object/id";

describe("UpdateViewService", () => {
  const userId = Id.generate().value;
  let repo: InMemorySavedViewRepository;
  let uow: InMemoryUnitOfWork;
  let service: UpdateViewService;

  beforeEach(() => {
    repo = new InMemorySavedViewRepository();
    uow = new InMemoryUnitOfWork();
    service = new UpdateViewService({ viewRepo: repo, uow });
  });

  it("updates name, description, nameFilter, and tagIds", async () => {
    const view = makeSavedView({ name: "Old Name", userId, nameFilter: "old" });
    await repo.save(view);
    const tagId = Id.generate().value;

    await service.execute({
      viewId: view.data.id.value,
      name: "New Name",
      description: "Updated desc",
      nameFilter: "new",
      tagIds: [tagId],
      userId,
    });

    const updated = repo.all()[0];
    expect(updated.data.name.value).toBe("New Name");
    expect(updated.data.description).toBe("Updated desc");
    expect(updated.data.nameFilter).toBe("new");
    expect(updated.data.tagIds).toEqual([tagId]);
  });

  it("allows keeping the same name", async () => {
    const view = makeSavedView({ name: "YouTube", userId, nameFilter: "yt" });
    await repo.save(view);

    await expect(
      service.execute({
        viewId: view.data.id.value,
        name: "YouTube",
        nameFilter: "youtube",
        userId,
      }),
    ).resolves.toBeUndefined();
  });

  it("throws SavedViewNameConflictError when renaming to an existing view name", async () => {
    const view1 = makeSavedView({ name: "YouTube", userId });
    const view2 = makeSavedView({ name: "Loans", userId, nameFilter: "loan" });
    await repo.save(view1);
    await repo.save(view2);

    await expect(
      service.execute({
        viewId: view2.data.id.value,
        name: "YouTube",
        nameFilter: "loan",
        userId,
      }),
    ).rejects.toThrow(SavedViewNameConflictError);
  });

  it("throws when view is not found", async () => {
    await expect(
      service.execute({
        viewId: Id.generate().value,
        name: "YouTube",
        nameFilter: "yt",
        userId,
      }),
    ).rejects.toThrow("View not found");
  });

  it("commits the unit of work", async () => {
    const view = makeSavedView({ name: "YouTube", userId, nameFilter: "yt" });
    await repo.save(view);
    const commitSpy = vi.spyOn(uow, "commit");

    await service.execute({
      viewId: view.data.id.value,
      name: "YouTube",
      nameFilter: "yt",
      userId,
    });

    expect(commitSpy).toHaveBeenCalledTimes(1);
  });
});
