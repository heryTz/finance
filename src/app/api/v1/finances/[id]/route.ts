import { apiGuard } from "@/lib/api-guard";
import { FinanceWithTag } from "@/entity";
import { NextResponse } from "next/server";
import { weh } from "@/lib/with-error-handler";
import {
  deleteFinance,
  getFinanceById,
  updateFinance,
} from "@/app/(dashboard)/finance/finance-service";
import { saveFinanceInputSchema } from "@/app/(dashboard)/finance/finance-dto";

type IdParams = { params: { id: string } };

export const GET = weh(async (_, { params }: IdParams) => {
  const { user } = await apiGuard();
  const finance = await getFinanceById(user.id, params.id);
  return NextResponse.json<FinanceWithTag>(finance);
});

export const PUT = weh(async (request: Request, { params }: IdParams) => {
  const { user } = await apiGuard();
  const input = saveFinanceInputSchema.parse(await request.json());
  const finance = await updateFinance(user.id, params.id, input);
  return NextResponse.json(finance);
});

export const DELETE = weh(async (_, { params }: IdParams) => {
  const { user } = await apiGuard();
  const finance = await deleteFinance(user.id, params.id);
  return NextResponse.json(finance);
});
