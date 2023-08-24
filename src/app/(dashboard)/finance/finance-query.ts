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
