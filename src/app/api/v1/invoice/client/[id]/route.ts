import { apiGuard } from "@/lib/api-guard";
import { prisma } from "@/lib/prisma";
import { weh } from "@/lib/with-error-handler";
import { NextResponse } from "next/server";

type IdParams = { params: { id: string } };

export type UpdateInvoiceClientInput = {
  name: string;
  email: string;
  phone: string | null;
  address: string;
  siren: string | null;
  ape: string | null;
  nif: string | null;
};

export const PUT = weh(async (request: Request, { params }: IdParams) => {
  const { user } = await apiGuard();

  const input = (await request.json()) as UpdateInvoiceClientInput;
  const client = await prisma.client.update({
    where: { id: params.id, ownerId: user.id },
    data: input,
  });

  return NextResponse.json(client);
});

export const DELETE = weh(async (request: Request, { params }: IdParams) => {
  const { user } = await apiGuard();
  const client = await prisma.client.delete({
    where: { id: params.id, ownerId: user.id },
  });
  return NextResponse.json(client);
});

export const GET = weh(async (request: Request, { params }: IdParams) => {
  const { user } = await apiGuard();
  const client = await prisma.client.findFirstOrThrow({
    where: { id: params.id, ownerId: user.id },
  });
  return NextResponse.json(client);
});
