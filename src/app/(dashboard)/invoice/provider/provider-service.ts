import { prisma } from "@/lib/prisma";
import { SaveProviderInput } from "./provider-dto";
import { Provider } from "@prisma/client";

export async function getProvider(userId: string) {
  return await prisma.provider.findFirst({
    where: { ownerId: userId },
  });
}

export type GetProvider = Awaited<ReturnType<typeof getProvider>>;

export async function saveProvider(userId: string, input: SaveProviderInput) {
  const data = { ...input, ownerId: userId };
  const existConfig = await prisma.provider.findFirst({
    where: { ownerId: userId },
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

  return provider;
}

export type SaveProvider = Awaited<ReturnType<typeof saveProvider>>;
