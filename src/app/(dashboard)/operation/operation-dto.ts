import { OperationType } from "@/entity/operation";
import { zd } from "@/lib/zod";
import { parseAsJson } from "nuqs/server";

export const operationFilterSheetSchema = zd.object({
  label: zd.string().nullish(),
  tags: zd.array(zd.string()).nullish(),
});

export const getOperationQuerySchema = zd
  .object({
    q: zd.string().nullish(),
    distinct: zd.enum(["true", "false"]).nullish(),
    page: zd.coerce.number().nullish(),
    pageSize: zd.coerce.number().nullish(),
  })
  .and(operationFilterSheetSchema);

export type GetOperationQuery = zd.infer<typeof getOperationQuerySchema>;

export const defaultGetOperationQuery: zd.infer<
  typeof getOperationQuerySchema
> = {
  page: 1,
  pageSize: 10,
  tags: [],
};

export function getOperationQuerySerializer() {
  return {
    key: "filter" as const,
    parser: parseAsJson(getOperationQuerySchema.parse).withDefault(
      defaultGetOperationQuery,
    ),
  };
}

export const saveOperationInputSchema = zd.object({
  label: zd.string().min(1),
  type: zd.nativeEnum(OperationType),
  tags: zd.array(zd.string()),
  amount: zd.coerce.number().min(0),
  createdAt: zd.coerce.date(),
});

export type SaveOperationInput = zd.infer<typeof saveOperationInputSchema>;
