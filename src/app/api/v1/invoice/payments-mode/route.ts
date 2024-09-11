import { getPaymentsMode } from "@/app/(dashboard)/invoice/payment-mode/payment-mode-service";
import { apiGuard } from "@/lib/api-guard";
import { weh } from "@/lib/with-error-handler";
import { NextResponse } from "next/server";

export const GET = weh(async () => {
  const { user } = await apiGuard();
  const paymentMode = await getPaymentsMode(user.id);
  return NextResponse.json(paymentMode);
});
