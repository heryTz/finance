import { httpClient } from "@/lib/http-client";
import { Client } from "@prisma/client";
import { useQuery } from "react-query";
import { GetClients } from "./client-service";

export function useGetClient() {
  return useQuery(useGetClient.name, () =>
    httpClient.get<GetClients>("/invoice/client"),
  );
}

export function useGetClientById(id?: string | null) {
  return useQuery({
    queryKey: [useGetClientById.name, id],
    enabled: !!id,
    queryFn: () => httpClient.get<Client>(`/invoice/client/${id}`),
  });
}

export function useGetClients() {
  return useQuery(useGetClients.name, () =>
    httpClient.get<GetClients>("/invoice/client").then((res) => res.data),
  );
}
