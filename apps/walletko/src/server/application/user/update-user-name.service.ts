import { Id } from "src/server/domain/shared/value-object/id";
import { Name } from "src/server/domain/shared/value-object/name";
import type { UserRepository } from "src/server/domain/user/user.repository";

type UpdateUserNameCommand = { userId: string; name: string };

export class UpdateUserNameService {
  constructor(private ctx: { userRepo: UserRepository }) {}

  async execute(cmd: UpdateUserNameCommand): Promise<void> {
    const userId = new Id(cmd.userId);
    const name = new Name(cmd.name);
    await this.ctx.userRepo.updateName(userId, name);
  }
}
