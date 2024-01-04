import * as z from "zod";
import { CURRENCY } from "./invoice-util";

export const createInvoiceSchema = z.object({
  client: z.string(),
  tva: z.number().optional(),
  currency: z.enum(CURRENCY),
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
