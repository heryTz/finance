import { Id } from "src/server/domain/shared/value-object/id";
import { Name } from "src/server/domain/shared/value-object/name";
import type { TagRepository } from "src/server/domain/tag/tag.repository";

export type TagInput = { id: string | null; name: string };
export type ResolvedTag = { id: string; name: string };

/**
 * Resolves client-supplied tags to tags the user actually owns before they are
 * attached to a transaction. A client `id` is honored only when it belongs to
 * the caller; anything else falls back to matching by name, and an unknown name
 * yields a freshly generated id for a tag to be created. This guarantees a
 * transaction can never link to another user's tag and that a new tag is never
 * inserted with a name the user already owns (which would dangle its FK).
 */
export async function resolveOwnedTags(
  tagRepo: TagRepository,
  userId: Id,
  inputs: TagInput[],
): Promise<ResolvedTag[]> {
  const owned = await tagRepo.findAll(userId);
  const ownedById = new Map(owned.map((t) => [t.data.id.value, t]));
  const ownedByName = new Map(owned.map((t) => [t.data.name.value, t]));

  const resolved = new Map<string, ResolvedTag>();
  const newIdByName = new Map<string, string>();

  for (const input of inputs) {
    const matchedById = input.id ? ownedById.get(input.id) : undefined;
    if (matchedById) {
      resolved.set(matchedById.data.id.value, {
        id: matchedById.data.id.value,
        name: matchedById.data.name.value,
      });
      continue;
    }

    const name = new Name(input.name).value;
    const matchedByName = ownedByName.get(name);
    if (matchedByName) {
      resolved.set(matchedByName.data.id.value, {
        id: matchedByName.data.id.value,
        name: matchedByName.data.name.value,
      });
      continue;
    }

    const id = newIdByName.get(name) ?? Id.generate().value;
    newIdByName.set(name, id);
    resolved.set(id, { id, name });
  }

  return [...resolved.values()];
}
