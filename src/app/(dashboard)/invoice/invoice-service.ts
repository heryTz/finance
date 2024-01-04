import { prisma } from "@/app/helper/prisma";

export async function getProducts() {
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });
  return { results: products };
}

export type GetProducts = Awaited<ReturnType<typeof getProducts>>;

export async function getInvoices() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: { Products: true, Client: true },
  });
  return { results: invoices };
}

export type GetInvoices = Awaited<ReturnType<typeof getInvoices>>;
