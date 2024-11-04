import { prisma } from "@/lib/prisma";
import { weh } from "@/lib/with-error-handler";
import { NextResponse } from "next/server";

export const GET = weh(async () => {
  let dbConnectionHealth = false;
  // TODO: check why prisma throw error "PrismaClientInitializationError" if I wrap this with try..catch
  await prisma.$queryRaw`SELECT 1`;
  dbConnectionHealth = true;

  return NextResponse.json({
    application: "ok",
    // unused
    dbConnection: dbConnectionHealth ? "ok" : "nok",
  });
});
