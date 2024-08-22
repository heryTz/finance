import { zd } from "@/lib/zod";

export const saveClientInputSchema = zd.object({
  name: zd.string(),
  email: zd.string(),
  phone: zd.string().nullish(),
  address: zd.string(),
  siren: zd.string().nullish(),
  ape: zd.string().nullish(),
  nif: zd.string().nullish(),
});

export type SaveClientInput = zd.infer<typeof saveClientInputSchema>;
