import { prisma } from "@/lib/prisma";
import bsqlite from "better-sqlite3";
import path from "path";

const db = bsqlite(path.resolve(__dirname, "../dev.db"), {
  fileMustExist: true,
});

async function run() {
  const user: any[] = await db.prepare(`SELECT * FROM User`).all();
  const finance: any[] = await db.prepare(`SELECT * FROM Finance`).all();
  const tag: any[] = await db.prepare(`SELECT * FROM Tag`).all();
  const financeTag: any[] = await db
    .prepare(`SELECT * FROM _FinanceToTag`)
    .all();
  const paymentMode: any[] = await db
    .prepare(`SELECT * FROM PaymentMode`)
    .all();
  const provider: any[] = await db.prepare(`SELECT * FROM Provider`).all();
  const invoice: any[] = await db.prepare(`SELECT * FROM Invoice`).all();
  const product: any[] = await db.prepare(`SELECT * FROM Product`).all();

  await prisma.product.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.paymentMode.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.finance.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: user.map((el) => ({
      ...el,
      emailVerified: el.emailVerified ? new Date(el.emailVerified) : null,
      createdAt: new Date(el.createdAt),
      updatedAt: new Date(el.updatedAt),
    })),
  });

  await prisma.tag.createMany({
    data: tag.map((el) => ({
      ...el,
      createdAt: new Date(el.createdAt),
      updatedAt: new Date(el.updatedAt),
    })),
  });

  for (const f of finance) {
    await prisma.finance.create({
      data: {
        ...f,
        createdAt: new Date(f.createdAt),
        updatedAt: new Date(f.updatedAt),
        tags: {
          connect: financeTag
            .filter((el) => el.A === f.id)
            .map((el) => ({ id: el.B })),
        },
      },
    });
  }

  await prisma.paymentMode.createMany({
    data: paymentMode.map((el) => ({
      ...el,
      createdAt: new Date(el.createdAt),
      updatedAt: new Date(el.updatedAt),
    })),
  });

  console.log({
    provider: provider.map((el) => el.id),
    invoice: invoice.map((el) => el.clientId),
  });
  await prisma.provider.createMany({
    data: provider.map((el) => ({
      ...el,
      createdAt: new Date(el.createdAt),
      updatedAt: new Date(el.updatedAt),
    })),
  });

  await prisma.invoice.createMany({
    data: invoice.map((el) => ({
      ...el,
      createdAt: new Date(el.createdAt),
      updatedAt: new Date(el.updatedAt),
    })),
  });

  await prisma.product.createMany({
    data: product.map((el) => ({
      ...el,
      createdAt: new Date(el.createdAt),
      updatedAt: new Date(el.updatedAt),
    })),
  });

  console.log("Success !!");
}

run();
