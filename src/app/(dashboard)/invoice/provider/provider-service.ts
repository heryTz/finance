import { prisma } from "@/lib/prisma";
import { SaveProviderInput } from "./provider-dto";
import { NotFoundException } from "@/lib/exception";

export async function getProviderById(userId: string, id: string) {
  const provider = await prisma.provider.findFirst({
    where: { ownerId: userId, id },
  });
  if (!provider) throw new NotFoundException();
  return provider;
}

export type GetProviderById = Awaited<ReturnType<typeof getProviderById>>;

export async function getProviders(userId: string) {
  const results = await prisma.provider.findMany({
    where: { ownerId: userId },
  });
  return { results };
}

export type GetProviders = Awaited<ReturnType<typeof getProviders>>;

export async function createProvider(userId: string, input: SaveProviderInput) {
  const provider = await prisma.provider.create({
    data: { ...input, ownerId: userId },
  });
  return provider;
}

export type CreateProvider = Awaited<ReturnType<typeof createProvider>>;

export async function updateProvider(
  userId: string,
  id: string,
  input: SaveProviderInput,
) {
  const provider = await prisma.provider.update({
    data: input,
    where: { id, ownerId: userId },
  });
  return provider;
}

export type UpdateProvider = Awaited<ReturnType<typeof updateProvider>>;

export async function deleteProvider(userId: string, id: string) {
  const provider = await prisma.provider.delete({
    where: { id: id, ownerId: userId },
  });
  return provider;
}

export type DeleteProvider = Awaited<ReturnType<typeof deleteProvider>>;
