import { PrismaClient } from "@prisma/client";

async function run() {
  const prisma = new PrismaClient();
  const operations = await prisma.operation.findMany();
  for (const item of operations) {
    await prisma.operation.update({
      where: { id: item.id },
      data: { createdAt: new Date(item.createdAt).toISOString() },
    });
  }

  console.log("Success !!");
}

run();
