import { eq } from "drizzle-orm";
import type { Id } from "src/server/domain/shared/value-object/id";
import type { Name } from "src/server/domain/shared/value-object/name";
import type { UserRepository } from "src/server/domain/user/user.repository";
import { db } from "src/server/infrastructure/db/client";
import { user } from "src/server/infrastructure/db/schema";

export class DrizzleUserRepository implements UserRepository {
  async updateName(userId: Id, name: Name): Promise<void> {
    await db
      .update(user)
      .set({ name: name.value, updatedAt: new Date() })
      .where(eq(user.id, userId.value));
  }
}
