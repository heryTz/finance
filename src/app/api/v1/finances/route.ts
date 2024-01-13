import { NextRequest, NextResponse } from "next/server";
import { apiGuard } from "@/lib/api-guard";
import {
  createFinance,
  getFinances,
} from "@/app/(dashboard)/finance/finance-service";
import {
  createFinanceInputSchema,
  getFinancesQuerySchema,
} from "@/app/(dashboard)/finance/finance-dto";
import { weh } from "@/lib/with-error-handler";

export const GET = weh(async (req: NextRequest) => {
  const { user } = await apiGuard();
  const searchParams = req.nextUrl.searchParams;
  const query = getFinancesQuerySchema.parse({
    q: searchParams.get("q"),
    distinct: searchParams.get("distinct"),
  });

  const finances = await getFinances(user.id, query);
  return NextResponse.json(finances);
});

export const POST = weh(async (request: Request) => {
  const { user } = await apiGuard();
  const input = createFinanceInputSchema.parse(await request.json());
  const finance = await createFinance(user!.id, input);
  return NextResponse.json(finance);
});
