import { httpClient } from "@/lib";
import { useMutation, useQuery } from "react-query";
import type { GetFinancesQuery, SaveFinanceInput } from "./finance-dto";
import type {
  CreateFinance,
  DeleteFinance,
  GetFinanceById,
  GetFinances,
  UpdateFinance,
} from "./finance-service";

export function useFinances({ q, distinct }: GetFinancesQuery = {}) {
  return useQuery([useFinances.name, q, distinct], ({ queryKey }) => {
    const [_, q, distinct] = queryKey;
    return httpClient.get<GetFinances>(`/finances`, {
      params: { q, distinct },
    });
  });
}

export function useFinanceSave() {
  return useMutation("finance.save", (data: SaveFinanceInput) =>
    httpClient.post<CreateFinance>(`/finances`, data),
  );
}

export function useFinanceById(id?: string) {
  return useQuery({
    queryKey: ["finance", id],
    queryFn: () => httpClient.get<GetFinanceById>(`/finances/${id}`),
    enabled: !!id,
  });
}

export function useFinanceUpdate() {
  return useMutation(
    "finance.update",
    ({ id, ...input }: SaveFinanceInput & { id: string }) =>
      httpClient.put<UpdateFinance>(`/finances/${id}`, input),
  );
}

export function useFinanceDelete() {
  return useMutation("finance.delete", (id: string) =>
    httpClient.delete<DeleteFinance>(`/finances/${id}`),
  );
}
