import { apiGuard } from "@/app/guards/api-guard";
import { prisma } from "@/app/helper/prisma";
import { UnauthorizedException } from "@/util/http";

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

export async function getInvoiceById(id: string) {
  return await prisma.invoice.findFirst({
    where: { id },
    include: { Products: true, Client: true, Payment: true },
  });
}

export type GetInvoiceById = Awaited<ReturnType<typeof getInvoiceById>>;

export async function getInvoiceConfig() {
  const { user, resp } = await apiGuard();
  if (resp) throw new UnauthorizedException();

  return await prisma.invoiceConfig.findFirstOrThrow({
    where: { ownerId: user!.id },
  });
}

export type GetInvoiceConfig = Awaited<ReturnType<typeof getInvoiceConfig>>;
