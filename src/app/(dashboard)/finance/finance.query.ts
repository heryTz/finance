import { GetFinanceResponse } from "@/app/api/v1/finances/route";
import { httpClient } from "@/app/helper";
import { useQuery } from "react-query";

export function useFinances() {
  return useQuery("finances", () =>
    httpClient.get<GetFinanceResponse>(`/finances`)
  );
}
