import { GetStats } from "@/app/(dashboard)/(stat)/stat-service";
import { httpClient } from "@/lib/http-client";
import { useQuery } from "@tanstack/react-query";

export const GET_STAT_COUNTER = "useGetStatCounter";

export function useGetStatCounter() {
  return useQuery({
    queryKey: [GET_STAT_COUNTER],
    queryFn: () =>
      httpClient
        .get<GetStats["countStat"]>("/stat/counters")
        .then((res) => res.data),
  });
}
