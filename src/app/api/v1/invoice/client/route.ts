import { apiGuard } from "@/lib/api-guard";
import { prisma } from "@/lib/prisma";
import { weh } from "@/lib/with-error-handler";
import { Client } from "@prisma/client";
import { NextResponse } from "next/server";

export type GetClientResponse = {
  results: Client[];
};

export const GET = weh(async () => {
  const { user } = await apiGuard();

  const clients = await prisma.client.findMany({
    where: { ownerId: user.id },
  });

  return NextResponse.json<GetClientResponse>({ results: clients });
});

export type InvoiceSaveClientInput = {
  name: string;
  email: string;
  phone: string | null;
  address: string;
  siren: string | null;
  ape: string | null;
  nif: string | null;
};

export const POST = weh(async (request: Request) => {
  const { user } = await apiGuard();

  const input = (await request.json()) as InvoiceSaveClientInput;
  const nbClient = await prisma.client.count({
    where: { ownerId: user.id },
  });

  const newClient = await prisma.client.create({
    data: { ...input, ref: `C${nbClient + 1}`, ownerId: user.id },
  });

  return NextResponse.json(newClient);
});
