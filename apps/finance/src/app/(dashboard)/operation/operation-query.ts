import { httpClient } from "@/lib/http-client";
import { useQuery } from "@tanstack/react-query";
import type { GetOperationQuery } from "./operation-dto";
import type { GetOperationById, GetOperations } from "./operation-service";

export const GET_OPERATIONS = "useGetOperations";

export function useGetOperations(query?: GetOperationQuery) {
  return useQuery({
    queryKey: [
      GET_OPERATIONS,
      query?.q,
      query?.distinct,
      query?.page,
      query?.pageSize,
    ],
    queryFn: async ({ queryKey }) => {
      const [, q, distinct, page, pageSize] = queryKey;
      return httpClient
        .get<GetOperations>(`/operations`, {
          params: { q, distinct, page, pageSize },
        })
        .then((resp) => resp.data);
    },
  });
}

export function useGetOperationById(id?: string) {
  return useQuery({
    queryKey: ["useGetOperationById", id],
    queryFn: () => httpClient.get<GetOperationById>(`/operations/${id}`),
    enabled: !!id,
  });
}
