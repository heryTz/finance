import { httpClient } from "@/lib/http-client";
import { useQuery } from "react-query";
import { GetInvoiceById } from "./invoice-service";

export function useGetInvoiceById(id: string | null) {
  return useQuery({
    queryKey: ["invoice.get", id],
    enabled: !!id,
    queryFn: () =>
      httpClient
        .get<GetInvoiceById>(`/invoice/${id}`)
        .then((resp) => resp.data),
  });
}
