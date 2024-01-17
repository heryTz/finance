import { FinanceType } from "@/entity";
import { z } from "zod";

export const getFinancesQuerySchema = z.object({
  q: z.string().nullable().optional(),
  distinct: z.enum(["true", "false"]).nullable().optional(),
});

export type GetFinancesQuery = z.infer<typeof getFinancesQuerySchema>;

export const saveFinanceInputSchema = z.object({
  label: z.string(),
  type: z.nativeEnum(FinanceType),
  tags: z.array(z.string()),
  amount: z.number(),
  createdAt: z.string(),
});

export type SaveFinanceInput = z.infer<typeof saveFinanceInputSchema>;
