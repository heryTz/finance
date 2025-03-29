import { NextResponse } from "next/server";
import { guard } from "@/lib/auth";
import { weh } from "@/lib/with-error-handler";
import { getCountStat } from "@/app/(dashboard)/(stat)/stat-service";

export const GET = weh(async () => {
  const { user } = await guard();
  const result = await getCountStat(user.id, { display: ["currentBalance"] });
  return NextResponse.json(result);
});
