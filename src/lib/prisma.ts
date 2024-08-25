import { PrismaClient } from "@prisma/client";

// https://github.com/prisma/prisma/issues/1983#issuecomment-620621213

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }

  prisma = (global as any).prisma;
}

export { prisma };
