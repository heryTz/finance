import { getPaymentModeById } from "@/app/(dashboard)/invoice/payment-mode/payment-mode-service";
import { guard } from "@/lib/auth";
import { weh } from "@/lib/with-error-handler";
import { NextResponse } from "next/server";

type IdParams = { params: Promise<{ id: string }> };

export const GET = weh(async (_, props: IdParams) => {
  const { user } = await guard();
  const params = await props.params;
  const mode = await getPaymentModeById(user.id, params.id);
  return NextResponse.json(mode);
});
