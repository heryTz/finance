import { httpClient } from "@/lib";
import { Client } from "@prisma/client";
import { useMutation, useQuery } from "react-query";
import type { SaveClientInput } from "./client-dto";
import { GetClients } from "./client-service";

export function useCreateInvoiceClient() {
  return useMutation("invoice.client.create", (data: SaveClientInput) =>
    httpClient.post<Client>("/invoice/client", data)
  );
}

export function useGetInvoiceClient() {
  return useQuery("invoice.client.get", () =>
    httpClient.get<GetClients>("/invoice/client")
  );
}

export function useGetByIdInvoiceClient(id: string | null) {
  return useQuery({
    queryKey: ["invoice.client.get", id],
    enabled: !!id,
    queryFn: () => httpClient.get<Client>(`/invoice/client/${id}`),
  });
}

export function usePutInvoiceClient(id: string | null) {
  return useMutation(
    ["invoice.client.put", id],
    (data: SaveClientInput) =>
      httpClient.put<Client>(`/invoice/client/${id}`, data)
  );
}

export function useInvoiceDeleteClient(id: string | null) {
  return useMutation(["invoice.client.delete", id], () =>
    httpClient.delete<Client>(`/invoice/client/${id}`)
  );
}
