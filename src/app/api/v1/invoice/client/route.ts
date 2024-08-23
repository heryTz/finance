import { saveClientInputSchema } from "@/app/(dashboard)/invoice/client/client-dto";
import { createClient } from "@/app/(dashboard)/invoice/client/client-service";
import { apiGuard } from "@/lib/api-guard";
import { weh } from "@/lib/with-error-handler";
import { NextResponse } from "next/server";

export const POST = weh(async (request: Request) => {
  const { user } = await apiGuard();
  const input = saveClientInputSchema.parse(await request.json());
  const client = await createClient(user.id, input);
  return NextResponse.json(client);
});
