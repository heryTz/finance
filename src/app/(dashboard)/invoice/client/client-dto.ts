import { zd } from "@/lib/zod";

export const saveClientInputSchema = zd.object({
  name: zd.string().min(1),
  email: zd.email().trim(),
  phone: zd.string().nullish(),
  address: zd.string().min(1),
  siren: zd.string().nullish(),
  ape: zd.string().nullish(),
  nif: zd.string().nullish(),
  entrepriseId: zd.string().nullish(),
});

export type SaveClientInput = zd.infer<typeof saveClientInputSchema>;
