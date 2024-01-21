import { saveClientInputSchema } from "@/app/(dashboard)/invoice/client/client-dto";
import {
  createClient,
  getClients,
} from "@/app/(dashboard)/invoice/client/client-service";
import { apiGuard } from "@/lib/api-guard";
import { weh } from "@/lib/with-error-handler";
import { NextResponse } from "next/server";

export const GET = weh(async () => {
  const { user } = await apiGuard();
  const data = await getClients(user.id);
  return NextResponse.json(data);
});

export const POST = weh(async (request: Request) => {
  const { user } = await apiGuard();
  const input = saveClientInputSchema.parse(await request.json());
  const client = await createClient(user.id, input);
  return NextResponse.json(client);
});
