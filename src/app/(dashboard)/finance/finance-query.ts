import { UpdateFinanceInput } from "@/app/api/v1/finances/[id]/route";
import {
  GetFinanceResponse,
  SaveFinanceInput,
} from "@/app/api/v1/finances/route";
import { httpClient } from "@/app/helper";
import { FinanceWithTag } from "@/entity";
import { useMutation, useQuery } from "react-query";

export function useFinances() {
  return useQuery("finance", () =>
    httpClient.get<GetFinanceResponse>(`/finances`)
  );
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
