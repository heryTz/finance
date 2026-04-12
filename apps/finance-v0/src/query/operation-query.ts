import { GetStats } from "@/app/(dashboard)/(stat)/stat-service";
import { httpClient } from "@/lib/http-client";
import { useQuery } from "@tanstack/react-query";

export const GET_OPERATION_COUNTER = "useGetOperationsCounter";

export function useGetOperationsCounter() {
  return useQuery({
    queryKey: [GET_OPERATION_COUNTER],
    queryFn: () =>
      httpClient
        .get<GetStats["countStat"]>("/operations/counters")
        .then((res) => res.data),
  });
}
