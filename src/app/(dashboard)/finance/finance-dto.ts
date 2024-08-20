import { FinanceType } from "@/entity";
import { zd } from "@/lib/zod";

export const getFinancesQuerySchema = zd.object({
  q: zd.string().nullable().optional(),
  distinct: zd.enum(["true", "false"]).nullable().optional(),
});

export type GetFinancesQuery = zd.infer<typeof getFinancesQuerySchema>;

export const saveFinanceInputSchema = zd.object({
  label: zd.string().min(1),
  type: zd.nativeEnum(FinanceType),
  tags: zd.array(zd.string()),
  amount: zd.coerce.number().min(1),
  createdAt: zd.coerce.date(),
});

export type SaveFinanceInput = zd.infer<typeof saveFinanceInputSchema>;
