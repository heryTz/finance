import { z } from "zod";

export const getFinancesQuerySchema = z.object({
  q: z.string().nullable().optional(),
  distinct: z.enum(["true", "false"]).nullable().optional(),
});

export type GetFinancesQuery = z.infer<typeof getFinancesQuerySchema>;
