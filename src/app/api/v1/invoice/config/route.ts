import { apiGuard } from "@/app/guards/api-guard";
import { prisma } from "@/app/helper/prisma";
import { InvoiceConfig } from "@prisma/client";
import { NextResponse } from "next/server";

export type SaveInvoiceConfigInput = {
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

  const input = (await request.json()) as SaveInvoiceConfigInput;

  const data = { ...input, ownerId: user!.id };
  const existConfig = await prisma.invoiceConfig.findFirst({
    where: { ownerId: user!.id },
  });

  let config: InvoiceConfig;
  if (existConfig) {
    config = await prisma.invoiceConfig.update({
      where: { id: existConfig.id },
      data,
    });
  } else {
    config = await prisma.invoiceConfig.create({ data });
  }

  return NextResponse.json(config);
}

export async function GET() {
  const { user, resp } = await apiGuard();
  if (resp) return resp;

  const config = await prisma.invoiceConfig.findFirst({
    where: { ownerId: user!.id },
  });

  if (!config) {
    const newConfig = await prisma.invoiceConfig.create({
      data: {
        ownerId: user!.id,
        address: "",
        email: "",
        name: "",
      },
    });
    return NextResponse.json(newConfig);
  }

  return NextResponse.json(config);
}
