import { PrismaClient } from "@prisma/client";

// https://github.com/prisma/prisma/issues/1983#issuecomment-620621213

let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  prisma = global.prisma;
}

export { prisma };
