import { prisma } from "@/lib/prisma";

beforeEach(async () => {
  await prisma.finance.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();
});