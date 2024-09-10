import { httpClient } from "@/lib/http-client";
import { useMutation, useQuery } from "react-query";
import type { SaveProviderInput } from "./provider-dto";
import type { GetProviderById, CreateProvider } from "./provider-service";

export function useSaveProvider() {
  return useMutation("invoice.save.provider", (data: SaveProviderInput) =>
    httpClient.post<CreateProvider>("/invoice/provider", data),
  );
}

export function useGetProvider() {
  return useQuery("invoice.provider", () =>
    httpClient.get<GetProviderById>("/invoice/provider"),
  );
}
