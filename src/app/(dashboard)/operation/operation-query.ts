import { httpClient } from "@/lib/http-client";
import { useMutation, useQuery } from "react-query";
import type { GetOperationQuery, SaveOperationInput } from "./operation-dto";
import type {
  CreateOperation,
  DeleteOperation,
  GetOperationById,
  GetOperations,
  UpdateOperation,
} from "./operation-service";

export function useOperations({ q, distinct }: GetOperationQuery = {}) {
  return useQuery([useOperations.name, q, distinct], ({ queryKey }) => {
    const [_, q, distinct] = queryKey;
    return httpClient.get<GetOperations>(`/operations`, {
      params: { q, distinct },
    });
  });
}

export function useOperationSave() {
  return useMutation("operation.save", (data: SaveOperationInput) =>
    httpClient.post<CreateOperation>(`/operations`, data),
  );
}

export function useOperationById(id?: string) {
  return useQuery({
    queryKey: ["operation", id],
    queryFn: () => httpClient.get<GetOperationById>(`/operations/${id}`),
    enabled: !!id,
  });
}

export function useOperationUpdate() {
  return useMutation(
    "operation.update",
    ({ id, ...input }: SaveOperationInput & { id: string }) =>
      httpClient.put<UpdateOperation>(`/operations/${id}`, input),
  );
}

export function useOperationDelete() {
  return useMutation("operation.delete", (id: string) =>
    httpClient.delete<DeleteOperation>(`/operations/${id}`),
  );
}
