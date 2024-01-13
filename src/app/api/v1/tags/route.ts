import { NextResponse } from "next/server";
import { apiGuard } from "@/lib/api-guard";
import { weh } from "@/lib/with-error-handler";
import { getTags } from "@/app/(dashboard)/tag/tag-service";

export const GET = weh(async () => {
  const { user } = await apiGuard();
  const tags = await getTags(user.id);
  return NextResponse.json({ results: tags });
});
