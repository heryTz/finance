"use server";

import { prisma } from "@/app/helper/prisma";
import { CreateInvoiceInput } from "./invoice-action-dto";
import { apiGuard } from "@/app/guards/api-guard";
import { UnauthorizedException } from "@/util/http";
import { redirect } from "next/navigation";

export async function createInvoice(input: CreateInvoiceInput) {
  const { user, resp } = await apiGuard();
  if (resp) throw new UnauthorizedException();

  const lastInvoice = await prisma.invoice.findFirst({
    where: { clientId: input.client },
    orderBy: { ref: "desc" },
  });
  const lastRef = lastInvoice?.ref ?? 0;

  const invoice = await prisma.invoice.create({
    data: {
      ownerId: user!.id,
      clientId: input.client,
      tva: input.tva || 0,
      ref: lastRef + 1,
      currency: input.currency,
      paymentModeId: input.paymentMode,
    },
  });

  await Promise.all(
    input.products.map((el) =>
      prisma.product.create({
        data: { ...el, ownerId: user!.id, invoiceId: invoice.id },
      })
    )
  );

  redirect("/invoice");
}
