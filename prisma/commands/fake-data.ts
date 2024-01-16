import { faker } from "@faker-js/faker";
import { FinanceType } from "../../src/entity";
import { prisma } from "@/lib/prisma";

async function run() {
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

  const clients = await prisma.client.findMany();
  for (let index = 0; index < clients.length; index++) {
    await prisma.client.update({
      where: { id: clients[index].id },
      data: {
        name: faker.animal.cat() + index,
        address: faker.lorem.words(2),
        ape: faker.number.int(100000).toString(),
        email: faker.person.firstName() + "@yopmail.fr",
        siren: faker.string.alpha(),
        nif: faker.string.alpha(),
        phone: faker.phone.number(),
      },
    });
  }

  const providers = await prisma.provider.findMany();
  for (const provider of providers) {
    await prisma.provider.update({
      where: { id: provider.id },
      data: {
        address: faker.lorem.words(2),
        ape: faker.number.int(100000).toString(),
        email: faker.person.firstName() + "@yopmail.fr",
        name: faker.person.fullName(),
        siren: faker.string.alpha(),
        nif: faker.string.alpha(),
        phone: faker.phone.number(),
      },
    });
  }

  const products = await prisma.product.findMany();
  for (const product of products) {
    await prisma.product.update({
      where: { id: product.id },
      data: {
        name: faker.commerce.product(),
        price: +faker.commerce.price(),
      },
    });
  }

  const paymentsInfo = await prisma.paymentMode.findMany();
  for (const payment of paymentsInfo) {
    await prisma.paymentMode.update({
      where: { id: payment.id },
      data: {
        accountName: faker.animal.crocodilia(),
        iban: faker.string.alphanumeric(),
        name: faker.commerce.department(),
      },
    });
  }

  console.log("Success !!");
}

run();
