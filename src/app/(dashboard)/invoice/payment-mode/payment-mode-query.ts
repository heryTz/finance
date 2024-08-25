import { httpClient } from "@/lib";
import { useQuery } from "react-query";
import type { GetPaymentModeById } from "./payment-mode-service";

export function useGetPaymentsMode(id?: string | null) {
  return useQuery({
    queryKey: ["invoice.payments.mode.get", id],
    enabled: !!id,
    queryFn: () =>
      httpClient
        .get<GetPaymentModeById>(`/invoice/payments-mode/${id}`)
        .then((resp) => resp.data),
  });
}
