import { httpClient } from "@/lib/http-client";
import { useQuery } from "@tanstack/react-query";
import type { GetProviderById, GetProviders } from "./provider-service";

export function useGetProviderById(id?: string) {
  return useQuery({
    enabled: !!id,
    queryKey: [useGetProviderById.name, id],
    queryFn: () =>
      httpClient
        .get<GetProviderById>(`/invoice/provider/${id}`)
        .then((res) => res.data),
  });
}

export function useGetProviders() {
  return useQuery({
    queryKey: [useGetProviders.name],
    queryFn: () =>
      httpClient.get<GetProviders>("/invoice/provider").then((res) => res.data),
  });
}
