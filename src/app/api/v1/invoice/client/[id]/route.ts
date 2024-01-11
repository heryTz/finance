import { apiGuard } from "@/app/guards/api-guard";
import { prisma } from "@/app/helper/prisma";
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

export async function PUT(request: Request, { params }: IdParams) {
  const { user, resp } = await apiGuard();
  if (resp) return resp;

  const input = (await request.json()) as UpdateInvoiceClientInput;
  const client = await prisma.client.update({
    where: { id: params.id, ownerId: user!.id },
    data: input,
  });

  return NextResponse.json(client);
}

export async function DELETE(request: Request, { params }: IdParams) {
  const { resp, user } = await apiGuard();
  if (resp) return resp;
  const client = await prisma.client.delete({
    where: { id: params.id, ownerId: user!.id },
  });
  return NextResponse.json(client);
}

export async function GET(request: Request, { params }: IdParams) {
  const { resp, user } = await apiGuard();
  if (resp) return resp;
  const client = await prisma.client.findFirstOrThrow({
    where: { id: params.id, ownerId: user!.id },
  });
  return NextResponse.json(client);
}
