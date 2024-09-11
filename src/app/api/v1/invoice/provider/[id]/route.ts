import { getProviderById } from "@/app/(dashboard)/invoice/provider/provider-service";
import { apiGuard } from "@/lib/api-guard";
import { weh } from "@/lib/with-error-handler";
import { NextResponse } from "next/server";

type IdParams = { params: { id: string } };

export const GET = weh(async (_: Request, { params }: IdParams) => {
  const { user } = await apiGuard();
  const provider = await getProviderById(user.id, params.id);
  return NextResponse.json(provider);
});
