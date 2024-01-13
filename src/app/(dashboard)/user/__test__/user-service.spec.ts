import { prisma } from "@/lib/prisma";
import { CreateUserInput } from "../user-dto";
import { createUser } from "../user-service";

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

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
