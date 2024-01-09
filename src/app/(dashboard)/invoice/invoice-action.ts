"use server";

import { prisma } from "@/app/helper/prisma";
import { CreateInvoiceInput } from "./invoice-action-dto";
import { apiGuard } from "@/app/guards/api-guard";
import { UnauthorizedException } from "@/util/http";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createInvoice(input: CreateInvoiceInput) {
  const { user, resp } = await apiGuard();
  if (resp) throw new UnauthorizedException();

  const { products, ...data } = input;
  const lastInvoice = await prisma.invoice.findFirst({
    where: { clientId: data.clientId },
    orderBy: { ref: "desc" },
  });
  const lastRef = lastInvoice?.ref ?? 0;

  const invoice = await prisma.invoice.create({
    data: {
      ownerId: user!.id,
      ref: lastRef + 1,
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
  const { user, resp } = await apiGuard();
  if (resp) throw new UnauthorizedException();

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
