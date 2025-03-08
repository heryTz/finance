import { zd } from "@/lib/zod";
import dayjs from "dayjs";
import { parseAsJson } from "nuqs/server";
import { operationFilterSheetSchema } from "../operation/operation-dto";

export const getStatsQuerySchema = zd
  .object({
    range: zd.object({
      from: zd.string(),
      to: zd.string().nullish(),
      customActualDate: zd.string().nullish(),
    }),
    display: zd.array(
      zd.enum([
        "currentBalance",
        "currentIncome",
        "currentExpense",
        "totalIncome",
        "totalExpense",
      ]),
    ),
  })
  .and(operationFilterSheetSchema);

export const defaultGetStatsQuery: zd.infer<typeof getStatsQuerySchema> = {
  range: {
    from: dayjs().startOf("year").format("YYYY-MM-DD"),
    to: dayjs().endOf("year").format("YYYY-MM-DD"),
  },
  tags: [],
  display: ["currentBalance", "currentIncome", "currentExpense"],
};

export function getStatsQuerySerializer() {
  return {
    key: "filter" as const,
    parser: parseAsJson(getStatsQuerySchema.parse).withDefault(
      defaultGetStatsQuery,
    ),
  };
}
