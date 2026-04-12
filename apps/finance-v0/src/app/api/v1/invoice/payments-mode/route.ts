import { getPaymentsMode } from "@/app/(dashboard)/invoice/payment-mode/payment-mode-service";
import { guard } from "@/lib/auth";
import { weh } from "@/lib/with-error-handler";
import { NextResponse } from "next/server";

export const GET = weh(async () => {
  const { user } = await guard();
  const paymentMode = await getPaymentsMode(user.id);
  return NextResponse.json(paymentMode);
});
