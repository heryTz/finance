import { saveClientInputSchema } from "@/app/(dashboard)/invoice/client/client-dto";
import {
  createClient,
  getClients,
} from "@/app/(dashboard)/invoice/client/client-service";
import { guard } from "@/lib/auth";
import { weh } from "@/lib/with-error-handler";
import { NextResponse } from "next/server";

export const POST = weh(async (request: Request) => {
  const { user } = await guard();
  const input = saveClientInputSchema.parse(await request.json());
  const client = await createClient(user.id, input);
  return NextResponse.json(client);
});

export const GET = weh(async () => {
  const { user } = await guard();
  const clients = await getClients(user.id);
  return NextResponse.json(clients);
});
