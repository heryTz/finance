import { Datetime } from "../shared/value-object/datetime";
import { Id } from "../shared/value-object/id";
import { Name } from "../shared/value-object/name";
import { SavedView } from "./saved-view";

export function makeSavedView(
  overrides: {
    name?: string;
    userId?: string;
    description?: string | null;
    nameFilter?: string | null;
    tagIds?: string[];
  } = {},
): SavedView {
  return new SavedView({
    id: Id.generate(),
    userId: overrides.userId ? new Id(overrides.userId) : Id.generate(),
    name: new Name(overrides.name ?? "test-view"),
    description: overrides.description ?? null,
    nameFilter: overrides.nameFilter ?? null,
    tagIds: overrides.tagIds ?? [],
    createdAt: Datetime.now(),
    updatedAt: null,
  });
}
