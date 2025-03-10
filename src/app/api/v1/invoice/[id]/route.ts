import { getInvoiceById } from "@/app/(dashboard)/invoice/(index)/invoice-service";
import { guard } from "@/lib/auth";
import { weh } from "@/lib/with-error-handler";
import { NextResponse } from "next/server";

type IdParams = { params: Promise<{ id: string }> };

export const GET = weh(async (_: Request, props: IdParams) => {
  const { user } = await guard();
  const params = await props.params;
  const invoice = await getInvoiceById(user.id, params.id);
  return NextResponse.json(invoice);
});
