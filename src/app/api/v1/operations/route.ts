import { NextRequest, NextResponse } from "next/server";
import { apiGuard } from "@/lib/api-guard";
import {
  createOperation,
  getOperations,
} from "@/app/(dashboard)/operation/operation-service";
import {
  saveOperationInputSchema,
  getOperationQuerySchema,
} from "@/app/(dashboard)/operation/operation-dto";
import { weh } from "@/lib/with-error-handler";

export const GET = weh(async (req: NextRequest) => {
  const { user } = await apiGuard();
  const searchParams = req.nextUrl.searchParams;
  const query = getOperationQuerySchema.parse({
    q: searchParams.get("q"),
    distinct: searchParams.get("distinct"),
    page: searchParams.get("page"),
    pageSize: searchParams.get("pageSize"),
  });

  const operations = await getOperations(user.id, query);
  return NextResponse.json(operations);
});

export const POST = weh(async (request: Request) => {
  const { user } = await apiGuard();
  const input = saveOperationInputSchema.parse(await request.json());
  const operation = await createOperation(user!.id, input);
  return NextResponse.json(operation);
});
