import { prisma } from "@/app/helper/prisma";

export async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    distinct: ["name"],
  });
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

export async function getInvoiceById(id: string) {
  return await prisma.invoice.findFirst({
    where: { id },
    include: { Products: true, Client: true, Payment: true },
  });
}

export type GetInvoiceById = Awaited<ReturnType<typeof getInvoiceById>>;