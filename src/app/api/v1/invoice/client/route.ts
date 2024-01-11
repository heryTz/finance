import { apiGuard } from "@/app/guards/api-guard";
import { prisma } from "@/app/helper/prisma";
import { Client } from "@prisma/client";
import { NextResponse } from "next/server";

export type GetClientResponse = {
  results: Client[];
};

export async function GET() {
  const { user, resp } = await apiGuard();
  if (resp) return resp;

  const clients = await prisma.client.findMany({
    where: { ownerId: user!.id },
  });

  return NextResponse.json<GetClientResponse>({ results: clients });
}

export type InvoiceSaveClientInput = {
  name: string;
  email: string;
  phone: string | null;
  address: string;
  siren: string | null;
  ape: string | null;
  nif: string | null;
};

export async function POST(request: Request) {
  const { user, resp } = await apiGuard();
  if (resp) return resp;

  const input = (await request.json()) as InvoiceSaveClientInput;
  const nbClient = await prisma.client.count({
    where: { ownerId: user!.id },
  });

  const newClient = await prisma.client.create({
    data: { ...input, ref: `C${nbClient + 1}`, ownerId: user!.id },
  });

  return NextResponse.json(newClient);
}
