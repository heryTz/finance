import { z } from "zod";

export const saveProviderInputSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable().optional(),
  address: z.string(),
  siren: z.string().nullable().optional(),
  ape: z.string().nullable().optional(),
  nif: z.string().nullable().optional(),
});

export type SaveProviderInput = z.infer<typeof saveProviderInputSchema>;
