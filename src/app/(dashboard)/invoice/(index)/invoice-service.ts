import { apiGuard } from "@/app/guards/api-guard";
import { prisma } from "@/app/helper/prisma";

export async function getProducts() {
  const { user } = await apiGuard();
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    distinct: ["name"],
    where: { ownerId: user!.id },
  });
  return { results: products };
}

export type GetProducts = Awaited<ReturnType<typeof getProducts>>;

export async function getInvoices() {
  const { user } = await apiGuard();
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: { Products: true, Client: true },
    where: { ownerId: user!.id },
  });
  return { results: invoices };
}

export type GetInvoices = Awaited<ReturnType<typeof getInvoices>>;

export async function getInvoiceById(id: string) {
  const { user } = await apiGuard();
  return await prisma.invoice.findFirst({
    where: { id, ownerId: user!.id },
    include: { Products: true, Client: true, Payment: true },
  });
}

export type GetInvoiceById = Awaited<ReturnType<typeof getInvoiceById>>;
