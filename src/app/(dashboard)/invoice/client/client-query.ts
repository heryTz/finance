import { UpdateInvoiceClientInput } from "@/app/api/v1/invoice/client/[id]/route";
import {
  GetClientResponse,
  InvoiceSaveClientInput,
} from "@/app/api/v1/invoice/client/route";
import { httpClient } from "@/app/helper";
import { Client } from "@prisma/client";
import { useMutation, useQuery } from "react-query";

export function useCreateInvoiceClient() {
  return useMutation("invoice.client.create", (data: InvoiceSaveClientInput) =>
    httpClient.post<Client>("/invoice/client", data)
  );
}

export function useGetInvoiceClient() {
  return useQuery("invoice.client.get", () =>
    httpClient.get<GetClientResponse>("/invoice/client")
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
    (data: UpdateInvoiceClientInput) =>
      httpClient.put<Client>(`/invoice/client/${id}`, data)
  );
}

export function useInvoiceDeleteClient(id: string | null) {
  return useMutation(["invoice.client.delete", id], () =>
    httpClient.delete<Client>(`/invoice/client/${id}`)
  );
}
