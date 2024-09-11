import { httpClient } from "@/lib/http-client";
import { useQuery } from "react-query";
import type { GetOperationQuery } from "./operation-dto";
import type { GetOperationById, GetOperations } from "./operation-service";

export function useGetOperations({ q, distinct }: GetOperationQuery = {}) {
  return useQuery([useGetOperations.name, q, distinct], ({ queryKey }) => {
    const [_, q, distinct] = queryKey;
    return httpClient
      .get<GetOperations>(`/operations`, {
        params: { q, distinct },
      })
      .then((resp) => resp.data);
  });
}

export function useGetOperationById(id?: string) {
  return useQuery({
    queryKey: [useGetOperationById.name, id],
    queryFn: () => httpClient.get<GetOperationById>(`/operations/${id}`),
    enabled: !!id,
  });
}
