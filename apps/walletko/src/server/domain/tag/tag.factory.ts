import { Datetime } from "../shared/value-object/datetime";
import { Id } from "../shared/value-object/id";
import { Name } from "../shared/value-object/name";
import { Tag } from "./tag";

export function makeTag(
  overrides: { name?: string; userId?: string } = {},
): Tag {
  return new Tag({
    id: Id.generate(),
    name: new Name(overrides.name ?? "test-tag"),
    userId: new Id(overrides.userId ?? Id.generate().value),
    createdAt: Datetime.now(),
    updatedAt: null,
  });
}
