import { httpClient } from "@/lib/http-client";
import { useQuery } from "react-query";
import type { GetOperationQuery } from "./operation-dto";
import type { GetOperationById, GetOperations } from "./operation-service";

export function useOperations({ q, distinct }: GetOperationQuery = {}) {
  return useQuery([useOperations.name, q, distinct], ({ queryKey }) => {
    const [_, q, distinct] = queryKey;
    return httpClient.get<GetOperations>(`/operations`, {
      params: { q, distinct },
    });
  });
}

export function useOperationById(id?: string) {
  return useQuery({
    queryKey: ["operation", id],
    queryFn: () => httpClient.get<GetOperationById>(`/operations/${id}`),
    enabled: !!id,
  });
}
