import { httpClient } from "@/lib/http-client";
import { useQuery } from "@tanstack/react-query";
import { GetInvoiceById } from "./invoice-service";

export function useGetInvoiceById(id: string | null) {
  return useQuery({
    queryKey: ["useGetInvoiceById", id],
    enabled: !!id,
    queryFn: () =>
      httpClient
        .get<GetInvoiceById>(`/invoice/${id}`)
        .then((resp) => resp.data),
  });
}
