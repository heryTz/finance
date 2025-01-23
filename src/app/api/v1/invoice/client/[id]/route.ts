import { saveClientInputSchema } from "@/app/(dashboard)/invoice/client/client-dto";
import {
  deleteClient,
  getClientById,
  updateClient,
} from "@/app/(dashboard)/invoice/client/client-service";
import { apiGuard } from "@/lib/api-guard";
import { weh } from "@/lib/with-error-handler";
import { NextResponse } from "next/server";

type IdParams = { params: Promise<{ id: string }> };

export const PUT = weh(async (request: Request, props: IdParams) => {
  const { user } = await apiGuard();
  const params = await props.params;
  const input = saveClientInputSchema.parse(await request.json());
  const client = await updateClient(user.id, params.id, input);
  return NextResponse.json(client);
});

export const DELETE = weh(async (_: Request, props: IdParams) => {
  const { user } = await apiGuard();
  const params = await props.params;
  const client = await deleteClient(user.id, params.id);
  return NextResponse.json(client);
});

export const GET = weh(async (_: Request, props: IdParams) => {
  const { user } = await apiGuard();
  const params = await props.params;
  const client = await getClientById(user.id, params.id);
  return NextResponse.json(client);
});
