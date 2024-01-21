import { getPaymentModeById } from "@/app/(dashboard)/invoice/payment-mode/payment-mode-service";
import { apiGuard } from "@/lib/api-guard";
import { weh } from "@/lib/with-error-handler";
import { NextResponse } from "next/server";

type IdParams = { params: { id: string } };

export const GET = weh(async (_, { params }: IdParams) => {
  const { user } = await apiGuard();
  const mode = await getPaymentModeById(user.id, params.id);
  return NextResponse.json(mode);
});
