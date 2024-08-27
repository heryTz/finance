import { zd } from "@/lib/zod";
import dayjs from "dayjs";
import { parseAsJson } from "nuqs";

export const getStatsQuerySchema = zd.object({
  range: zd.object({
    from: zd.coerce.date(),
    to: zd.coerce.date(),
  }),
});

export const defaultGetStatsQuery = {
  range: {
    from: dayjs().startOf("year").toDate(),
    to: dayjs().endOf("year").toDate(),
  },
};

export function getStatsQuerySerializer() {
  return {
    key: "filter" as const,
    parser: parseAsJson(getStatsQuerySchema.parse).withDefault(
      defaultGetStatsQuery,
    ),
  };
}
