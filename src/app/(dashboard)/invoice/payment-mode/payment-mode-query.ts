import { httpClient } from "@/lib";
import { PaymentMode } from "@prisma/client";
import { useQuery } from "react-query";

export function useGetPaymentsMode(id: string | null) {
  return useQuery({
    queryKey: ["invoice.payments.mode.get", id],
    enabled: !!id,
    queryFn: () =>
      httpClient
        .get<PaymentMode>(`/invoice/payments-mode/${id}`)
        .then((resp) => resp.data),
  });
}
