import { CreateUserInput } from "../user-dto";
import { createUser } from "../user-service";

describe("user service", () => {
  it("create user", async () => {
    const input: CreateUserInput = {
      email: "test-prisma@example.com",
    };
    const user = await createUser(input);
    expect(user.email).toBe(input.email);
    expect(user.emailVerified).toBeTruthy();
  });
});
