import { SaveProviderInput } from "@/app/api/v1/invoice/provider/route";
import { httpClient } from "@/lib";
import { Provider } from "@prisma/client";
import { useMutation, useQuery } from "react-query";

export function useSaveProvider() {
  return useMutation("invoice.save.provider", (data: SaveProviderInput) =>
    httpClient.post<Provider>("/invoice/provider", data)
  );
}

export function useGetProvider() {
  return useQuery("invoice.provider", () =>
    httpClient.get<Provider>("/invoice/provider")
  );
}
