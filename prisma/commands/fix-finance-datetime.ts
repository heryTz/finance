import { PrismaClient } from "@prisma/client";

async function run() {
  const prisma = new PrismaClient();
  const finances = await prisma.finance.findMany();
  for (const item of finances) {
    await prisma.finance.update({
      where: { id: item.id },
      data: { createdAt: new Date(item.createdAt).toISOString() },
    });
  }

  console.log("Success !!")
}

run();
