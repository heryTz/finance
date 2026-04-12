import { NextResponse } from "next/server";
import { guard } from "@/lib/auth";
import { weh } from "@/lib/with-error-handler";
import { getTags } from "@/app/(dashboard)/tag/tag-service";

export const GET = weh(async () => {
  const { user } = await guard();
  const tags = await getTags(user.id);
  return NextResponse.json(tags);
});
