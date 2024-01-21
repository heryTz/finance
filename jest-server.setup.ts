import { prisma } from "@/lib/prisma";

beforeEach(async () => {
  await prisma.finance.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.paymentMode.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.product.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();
});
