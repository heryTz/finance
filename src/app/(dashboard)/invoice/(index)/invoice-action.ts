"use server";

import { prisma } from "@/lib/prisma";
import { CreateInvoiceInput } from "./invoice-dto";
import { apiGuard } from "@/lib/api-guard";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createInvoice(input: CreateInvoiceInput) {
  const { user } = await apiGuard();

  const { products, ...data } = input;
  const nbInvoice = await prisma.invoice.count({
    where: { clientId: data.clientId },
  });
  const client = await prisma.client.findFirstOrThrow({
    where: { id: data.clientId },
  });

  const invoice = await prisma.invoice.create({
    data: {
      ownerId: user!.id,
      ref: `${client.ref}-${nbInvoice + 1}`,
      ...data,
    },
  });

  await Promise.all(
    products.map((el) =>
      prisma.product.create({
        data: { ...el, ownerId: user!.id, invoiceId: invoice.id },
      })
    )
  );

  revalidatePath("/invoice");
  redirect("/invoice");
}

export async function updateInvoice(id: string, input: CreateInvoiceInput) {
  const { user } = await apiGuard();

  const { products, ...data } = input;
  // make it sample for now
  await prisma.product.deleteMany({ where: { invoiceId: id } });

  await prisma.invoice.update({
    where: { id },
    data,
  });

  await Promise.all(
    products.map((el) =>
      prisma.product.create({
        data: { ...el, ownerId: user!.id, invoiceId: id },
      })
    )
  );

  revalidatePath("/invoice");
  redirect("/invoice");
}

export async function deleteInvoice(id: string) {
  await apiGuard();
  await prisma.invoice.delete({ where: { id } });
  revalidatePath("/invoice");
}
