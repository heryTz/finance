import { apiGuard } from "@/lib/api-guard";
import { prisma } from "@/lib/prisma";
import { weh } from "@/lib/with-error-handler";
import { NextResponse } from "next/server";

type IdParams = { params: { id: string } };

export const GET = weh(async (_, { params }: IdParams) => {
  const { user } = await apiGuard();
  const mode = await prisma.paymentMode.findFirstOrThrow({
    where: { id: params.id, onwerId: user!.id },
  });
  return NextResponse.json(mode);
});
