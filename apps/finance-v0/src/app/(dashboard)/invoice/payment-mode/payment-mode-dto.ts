import * as z from "zod/v4";

export const createPaymentModeSchema = z.object({
  name: z.string().min(1),
  accountName: z.string().nullish(),
  iban: z.string().nullish(),
  bic: z.string().nullish(),
});

export type CreatePaymentModeInput = z.infer<typeof createPaymentModeSchema>;
