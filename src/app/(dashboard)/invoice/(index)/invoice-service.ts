import { NotFoundException } from "@/lib/exception";
import { prisma } from "@/lib/prisma";
import { CreateInvoiceInput, SendInvoiceMailInput } from "./invoice-dto";
import { sendEmail } from "@/lib/mailer";
import { getProvider } from "../provider/provider-service";

export async function getProducts(userId: string) {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    distinct: ["name"],
    where: { ownerId: userId },
  });
  return { results: products };
}

export type GetProducts = Awaited<ReturnType<typeof getProducts>>;

export async function getInvoices(userId: string) {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: { Products: true, Client: true },
    where: { ownerId: userId },
  });
  return { results: invoices };
}

export type GetInvoices = Awaited<ReturnType<typeof getInvoices>>;

export async function getInvoiceById(userId: string, id: string) {
  const invoice = await prisma.invoice.findFirst({
    where: { id, ownerId: userId },
    include: { Products: true, Client: true, Payment: true },
  });
  if (!invoice) throw new NotFoundException();
  return invoice;
}

export type GetInvoiceById = Awaited<ReturnType<typeof getInvoiceById>>;

export async function createInvoice(userId: string, input: CreateInvoiceInput) {
  const { products, ...data } = input;
  const nbInvoice = await prisma.invoice.count({
    where: { clientId: data.clientId },
  });
  const client = await prisma.client.findFirstOrThrow({
    where: { id: data.clientId },
  });

  const invoice = await prisma.invoice.create({
    data: {
      ownerId: userId,
      ref: `${client.ref}-${nbInvoice + 1}`,
      ...data,
    },
  });

  await prisma.product.createMany({
    data: products.map((el) => ({
      ...el,
      ownerId: userId,
      invoiceId: invoice.id,
    })),
  });

  return invoice;
}

export async function updateInvoice(
  userId: string,
  id: string,
  input: CreateInvoiceInput,
) {
  const { products, ...data } = input;
  // make it sample for now
  await prisma.product.deleteMany({ where: { invoiceId: id } });

  const invoice = await prisma.invoice.update({
    where: { id, ownerId: userId },
    data,
  });

  await prisma.product.createMany({
    data: products.map((el) => ({
      ...el,
      ownerId: userId,
      invoiceId: id,
    })),
  });

  return invoice;
}

export async function deleteInvoice(userId: string, id: string) {
  return await prisma.invoice.delete({ where: { id, ownerId: userId } });
}

export async function sendInvoiceMail(
  userId: string,
  id: string,
  input: SendInvoiceMailInput,
) {
  try {
    const provider = await getProvider(userId);
    if (!provider) throw new Error(`Empty provider`);

    const invoice = await getInvoiceById(userId, id);
    const content = input.content.replace(/(?:\r\n|\r|\n)/g, "<br>");
    await sendEmail({
      ...input,
      content,
      to: invoice.Client.email,
      attachments: [{ path: input.file, filename: input.filename }],
      cc: { address: provider.email, name: provider.name },
      replyTo: { address: provider.email, name: provider.name },
    });
  } catch (error) {
    throw new Error(`Echec de l'envoi de l'e-mail`);
  }
}
