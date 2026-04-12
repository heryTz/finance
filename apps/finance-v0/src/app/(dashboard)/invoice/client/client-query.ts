import { httpClient } from "@/lib/http-client";
import { Client } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { GetClients } from "./client-service";

export function useGetClientById(id?: string | null) {
  return useQuery({
    queryKey: ["useGetClientById", id],
    enabled: !!id,
    queryFn: () => httpClient.get<Client>(`/invoice/client/${id}`),
  });
}

export function useGetClients() {
  return useQuery({
    queryKey: ["useGetClients"],
    queryFn: () =>
      httpClient.get<GetClients>("/invoice/client").then((res) => res.data),
  });
}
