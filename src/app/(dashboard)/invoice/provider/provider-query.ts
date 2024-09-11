import { httpClient } from "@/lib/http-client";
import { useQuery } from "react-query";
import type { GetProviderById, GetProviders } from "./provider-service";

export function useGetByIdProvider(id?: string) {
  return useQuery({
    enabled: !!id,
    queryKey: [useGetByIdProvider.name, id],
    queryFn: () =>
      httpClient
        .get<GetProviderById>(`/invoice/provider/${id}`)
        .then((res) => res.data),
  });
}

export function useGetProviders() {
  return useQuery([useGetProviders.name], () =>
    httpClient.get<GetProviders>("/invoice/provider").then((res) => res.data),
  );
}
