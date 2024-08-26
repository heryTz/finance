import { apiGuard } from "@/lib/api-guard";
import { NextResponse } from "next/server";
import { weh } from "@/lib/with-error-handler";
import {
  deleteOperation,
  getOperationById,
  updateOperation,
} from "@/app/(dashboard)/operation/operation-service";
import { saveOperationInputSchema } from "@/app/(dashboard)/operation/operation-dto";

type IdParams = { params: { id: string } };

export const GET = weh(async (_, { params }: IdParams) => {
  const { user } = await apiGuard();
  const operation = await getOperationById(user.id, params.id);
  return NextResponse.json(operation);
});

export const PUT = weh(async (request: Request, { params }: IdParams) => {
  const { user } = await apiGuard();
  const input = saveOperationInputSchema.parse(await request.json());
  const operation = await updateOperation(user.id, params.id, input);
  return NextResponse.json(operation);
});

export const DELETE = weh(async (_, { params }: IdParams) => {
  const { user } = await apiGuard();
  const operation = await deleteOperation(user.id, params.id);
  return NextResponse.json(operation);
});
