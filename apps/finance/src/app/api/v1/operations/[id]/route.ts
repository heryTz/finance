import { guard } from "@/lib/auth";
import { NextResponse } from "next/server";
import { weh } from "@/lib/with-error-handler";
import {
  deleteOperation,
  getOperationById,
  updateOperation,
} from "@/app/(dashboard)/operation/operation-service";
import { saveOperationInputSchema } from "@/app/(dashboard)/operation/operation-dto";

type IdParams = { params: Promise<{ id: string }> };

export const GET = weh(async (_, props: IdParams) => {
  const { user } = await guard();
  const params = await props.params;
  const operation = await getOperationById(user.id, params.id);
  return NextResponse.json(operation);
});

export const PUT = weh(async (request: Request, props: IdParams) => {
  const { user } = await guard();
  const params = await props.params;
  const input = saveOperationInputSchema.parse(await request.json());
  const operation = await updateOperation(user.id, params.id, input);
  return NextResponse.json(operation);
});

export const DELETE = weh(async (_, props: IdParams) => {
  const { user } = await guard();
  const params = await props.params;
  const operation = await deleteOperation(user.id, params.id);
  return NextResponse.json(operation);
});
