import { apiGuard } from "@/lib/api-guard";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type IdParams = { params: { id: string } };

export async function GET(request: Request, { params }: IdParams) {
  const { resp, user } = await apiGuard();
  if (resp) return resp;
  const mode = await prisma.paymentMode.findFirstOrThrow({
    where: { id: params.id, onwerId: user!.id },
  });
  return NextResponse.json(mode);
}
