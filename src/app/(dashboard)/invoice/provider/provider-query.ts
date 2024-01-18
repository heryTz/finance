import { httpClient } from "@/lib";
import { useMutation, useQuery } from "react-query";
import type { SaveProviderInput } from "./provider-dto";
import type { GetProvider, SaveProvider } from "./provider-service";

export function useSaveProvider() {
  return useMutation("invoice.save.provider", (data: SaveProviderInput) =>
    httpClient.post<SaveProvider>("/invoice/provider", data)
  );
}

export function useGetProvider() {
  return useQuery("invoice.provider", () =>
    httpClient.get<GetProvider>("/invoice/provider")
  );
}
