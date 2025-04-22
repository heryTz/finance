import { prisma } from "@/lib/prisma";
import { weh } from "@/lib/with-error-handler";
import { NextResponse } from "next/server";
import { join } from "path";
import fs from "fs";
import { logError } from "@/lib/logger";

export const GET = weh(async () => {
  let dbConnectionHealth = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbConnectionHealth = true;
  } catch (error) {
    logError(error);
    dbConnectionHealth = false;
  }

  const buildIdPath = join(process.cwd(), ".next", "BUILD_ID");
  const buildId = fs.readFileSync(buildIdPath, "utf8");

  return NextResponse.json({
    application: "ok",
    dbConnection: dbConnectionHealth ? "ok" : "nok",
    buildId: buildId ?? "unspecified",
  });
});
