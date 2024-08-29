import { zd } from "@/lib/zod";
import dayjs from "dayjs";
import { parseAsJson } from "nuqs";

export const getStatsQuerySchema = zd.object({
  range: zd.object({
    from: zd.coerce.date(),
    to: zd.coerce.date(),
    customActualDate: zd.coerce.date().nullish(),
  }),
  label: zd.string().nullish(),
  tags: zd.array(zd.string()),
});

export const defaultGetStatsQuery: zd.infer<typeof getStatsQuerySchema> = {
  range: {
    from: dayjs().startOf("year").toDate(),
    to: dayjs().endOf("year").toDate(),
  },
  tags: [],
};

export function getStatsQuerySerializer() {
  return {
    key: "filter" as const,
    parser: parseAsJson(getStatsQuerySchema.parse).withDefault(
      defaultGetStatsQuery,
    ),
  };
}
