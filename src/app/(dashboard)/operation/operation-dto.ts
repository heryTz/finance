import { OperationType } from "@/entity";
import { zd } from "@/lib/zod";

export const getOperationQuerySchema = zd.object({
  q: zd.string().nullable().optional(),
  distinct: zd.enum(["true", "false"]).nullable().optional(),
});

export type GetOperationQuery = zd.infer<typeof getOperationQuerySchema>;

export const saveOperationInputSchema = zd.object({
  label: zd.string().min(1),
  type: zd.nativeEnum(OperationType),
  tags: zd.array(zd.string()),
  amount: zd.coerce.number().min(1),
  createdAt: zd.coerce.date(),
});

export type SaveOperationInput = zd.infer<typeof saveOperationInputSchema>;
