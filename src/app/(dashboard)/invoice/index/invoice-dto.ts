import * as z from "zod";
import { getCurrency } from "./invoice-util";

export const createInvoiceSchema = z.object({
  clientId: z.string().min(1),
  providerId: z.string().min(1),
  paymentModeId: z.string().min(1),
  tva: z.coerce.number().nullish(),
  currency: z.enum(getCurrency()),
  createdAt: z.coerce.date(),
  products: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.coerce.number(),
        qte: z.coerce.number(),
      }),
    )
    .min(1),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;

export const sendInvoiceMailInputSchema = z.object({
  subject: z.string().min(1),
  content: z.string().min(1),
  file: z.string().min(1),
  filename: z.string().optional(),
});

export type SendInvoiceMailInput = z.infer<typeof sendInvoiceMailInputSchema>;
