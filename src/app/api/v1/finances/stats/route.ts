import { apiGuard } from "@/lib/api-guard";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { weh } from "@/lib/with-error-handler";
import { getStats } from "@/app/(dashboard)/(stat)/stat-service";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const GET = weh(async () => {
  const { user } = await apiGuard();
  const stats = await getStats(user.id);
  return NextResponse.json(stats);
});
