import { prisma } from "@/app/helper/prisma";

export async function getProducts() {
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });
  return { results: products };
}

export type GetProducts = Awaited<ReturnType<typeof getProducts>>;
