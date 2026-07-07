import { UpdateUserNameService } from "src/server/application/user/update-user-name.service";
import type { UserRepository } from "src/server/domain/user/user.repository";
import { Id } from "src/server/domain/shared/value-object/id";

describe("update user name", () => {
  let updateNameFn: ReturnType<typeof vi.fn>;
  let userRepo: UserRepository;
  let service: UpdateUserNameService;

  beforeEach(() => {
    updateNameFn = vi.fn().mockResolvedValue(undefined);
    userRepo = { updateName: updateNameFn };
    service = new UpdateUserNameService({ userRepo });
  });

  it("calls updateName with correct Id and Name", async () => {
    const userId = Id.generate().value;
    await service.execute({ userId, name: "Alice" });
    const [calledUserId, calledName] = updateNameFn.mock.calls[0];
    expect(calledUserId.value).toBe(userId);
    expect(calledName.value).toBe("Alice");
  });

  it("throws when name is empty", async () => {
    await expect(
      service.execute({ userId: Id.generate().value, name: "" }),
    ).rejects.toThrow("Name should not be empty");
  });

  it("propagates error from userRepo.updateName", async () => {
    updateNameFn.mockRejectedValue(new Error("db failure"));
    await expect(
      service.execute({ userId: Id.generate().value, name: "Alice" }),
    ).rejects.toThrow("db failure");
  });
});
