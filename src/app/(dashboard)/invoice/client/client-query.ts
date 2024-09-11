import { httpClient } from "@/lib/http-client";
import { Client } from "@prisma/client";
import { useQuery } from "react-query";
import { GetClients } from "./client-service";

export function useGetInvoiceClient() {
  return useQuery("invoice.client.get", () =>
    httpClient.get<GetClients>("/invoice/client"),
  );
}

export function useGetByIdInvoiceClient(id?: string | null) {
  return useQuery({
    queryKey: ["invoice.client.get", id],
    enabled: !!id,
    queryFn: () => httpClient.get<Client>(`/invoice/client/${id}`),
  });
}

export function useGetInvoiceClients() {
  return useQuery(useGetInvoiceClients.name, () =>
    httpClient.get<GetClients>("/invoice/client").then((res) => res.data),
  );
}
