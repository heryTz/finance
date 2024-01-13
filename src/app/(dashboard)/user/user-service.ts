import { prisma } from "@/lib/prisma";
import { CreateUserInput } from "./user-dto";

export async function createUser(input: CreateUserInput) {
  return await prisma.user.create({
    data: { ...input, emailVerified: new Date().toISOString() },
  });
}
