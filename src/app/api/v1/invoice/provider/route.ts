import { apiGuard } from "@/app/guards/api-guard";
import { prisma } from "@/app/helper/prisma";
import { Provider } from "@prisma/client";
import { NextResponse } from "next/server";

export type SaveProviderInput = {
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

  const input = (await request.json()) as SaveProviderInput;

  const data = { ...input, ownerId: user!.id };
  const existConfig = await prisma.provider.findFirst({
    where: { ownerId: user!.id },
  });

  let provider: Provider;
  if (existConfig) {
    provider = await prisma.provider.update({
      where: { id: existConfig.id },
      data,
    });
  } else {
    provider = await prisma.provider.create({ data });
  }

  return NextResponse.json(provider);
}

export async function GET() {
  const { user, resp } = await apiGuard();
  if (resp) return resp;

  const provider = await prisma.provider.findFirst({
    where: { ownerId: user!.id },
  });

  if (!provider) {
    const newProvider = await prisma.provider.create({
      data: {
        ownerId: user!.id,
        address: "",
        email: "",
        name: "",
      },
    });
    return NextResponse.json(newProvider);
  }

  return NextResponse.json(provider);
}
