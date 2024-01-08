import { apiGuard } from "@/app/guards/api-guard";
import { prisma } from "@/app/helper/prisma";
import { NextResponse } from "next/server";

type IdParams = { params: { id: string } };

export async function GET(request: Request, { params }: IdParams) {
  const { resp } = await apiGuard();
  if (resp) return resp;
  const mode = await prisma.paymentMode.findFirstOrThrow({
    where: { id: params.id },
  });
  return NextResponse.json(mode);
}
