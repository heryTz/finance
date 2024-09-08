import { zd } from "@/lib/zod";

export const saveClientInputSchema = zd.object({
  name: zd.string().min(1),
  email: zd.string().trim().email(),
  phone: zd.string().nullish(),
  address: zd.string().min(1),
  siren: zd.string().nullish(),
  ape: zd.string().nullish(),
  nif: zd.string().nullish(),
});

export type SaveClientInput = zd.infer<typeof saveClientInputSchema>;
