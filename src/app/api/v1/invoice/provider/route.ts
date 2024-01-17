import { apiGuard } from "@/lib/api-guard";
import { prisma } from "@/lib/prisma";
import { weh } from "@/lib/with-error-handler";
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

export const POST = weh(async (request: Request) => {
  const { user } = await apiGuard();

  const input = (await request.json()) as SaveProviderInput;

  const data = { ...input, ownerId: user.id };
  const existConfig = await prisma.provider.findFirst({
    where: { ownerId: user.id },
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
});

export const GET = weh(async () => {
  const { user } = await apiGuard();

  const provider = await prisma.provider.findFirst({
    where: { ownerId: user.id },
  });

  if (!provider) {
    const newProvider = await prisma.provider.create({
      data: {
        ownerId: user.id,
        address: "",
        email: "",
        name: "",
      },
    });
    return NextResponse.json(newProvider);
  }

  return NextResponse.json(provider);
});
