import { zd } from "@/lib/zod";

export const getStatsQuerySchema = zd.object({
  startDate: zd.coerce.date(),
  endDate: zd.coerce.date(),
});
