import type { UpdateFinanceInput } from "@/app/api/v1/finances/[id]/route";
import type { FinanceAnalytics } from "@/app/api/v1/finances/analytics/route";
import type {
  GetFinanceQuery,
  GetFinanceResponse,
  SaveFinanceInput,
} from "@/app/api/v1/finances/route";
import { httpClient } from "@/lib";
import type { FinanceWithTag } from "@/entity";
import { useMutation, useQuery } from "react-query";

export function useFinances({ q, distinct }: GetFinanceQuery = {}) {
  return useQuery(["finance", q, distinct], ({ queryKey }) => {
    const [_, q, distinct] = queryKey;
    return httpClient.get<GetFinanceResponse>(`/finances`, {
      params: { q, distinct },
    });
  });
}

export function useFinanceSave() {
  return useMutation("finance.save", (data: SaveFinanceInput) =>
    httpClient.post<FinanceWithTag>(`/finances`, data)
  );
}

export function useFinanceById(id: string | null) {
  return useQuery({
    queryKey: ["finance", id],
    queryFn: () => httpClient.get<FinanceWithTag>(`/finances/${id}`),
    enabled: !!id,
  });
}

export function useFinanceUpdate() {
  return useMutation(
    "finance.update",
    ({ id, ...input }: UpdateFinanceInput & { id: string }) =>
      httpClient.put<FinanceWithTag>(`/finances/${id}`, input)
  );
}

export function useFinanceDelete() {
  return useMutation("finance.delete", (id: string) =>
    httpClient.delete<FinanceWithTag>(`/finances/${id}`)
  );
}

export function useFinanceAnalytics() {
  return useQuery({
    queryKey: "finance.analytics",
    queryFn: () => httpClient.get<FinanceAnalytics>(`/finances/analytics`),
  });
}
