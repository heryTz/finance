import * as z from "zod";

export const createPaymentModeSchema = z.object({
  name: z.string(),
  accountName: z.string().optional(),
  iban: z.string().optional(),
});

export type CreatePaymentModeInput = z.infer<typeof createPaymentModeSchema>;
