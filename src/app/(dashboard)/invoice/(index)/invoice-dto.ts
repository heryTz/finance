import * as z from "zod";
import { getCurrency } from "./invoice-util";

export const createInvoiceSchema = z.object({
  clientId: z.string(),
  paymentModeId: z.string(),
  tva: z.number().optional(),
  currency: z.enum(getCurrency()),
  products: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.number(),
        qte: z.number(),
      })
    )
    .min(1),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;

export const sendInvoiceMailInputSchema = z.object({
  subject: z.string(),
  content: z.string(),
  file: z.string(),
  filename: z.string().optional(),
});

export type SendInvoiceMailInput = z.infer<typeof sendInvoiceMailInputSchema>;
