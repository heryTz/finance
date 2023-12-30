import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { FinanceType } from "../../src/entity";

async function run() {
  const prisma = new PrismaClient();
  const finances = await prisma.finance.findMany();
  for (const finance of finances) {
    await prisma.finance.update({
      where: { id: finance.id },
      data: {
        label: faker.word.noun(),
        amount:
          finance.type === FinanceType.depense
            ? faker.number.int({ min: 1000, max: 1500 })
            : faker.number.int({ min: 3000, max: 10000 }),
      },
    });
  }

  const tags = await prisma.tag.findMany();
  for (let index = 0; index < tags.length; index++) {
    await prisma.tag.update({
      where: { id: tags[index].id },
      data: { name: faker.word.noun() + index },
    });
  }

  console.log("Success !!");
}

run();
