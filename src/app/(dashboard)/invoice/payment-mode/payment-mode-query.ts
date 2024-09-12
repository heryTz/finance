import { httpClient } from "@/lib/http-client";
import { useQuery } from "@tanstack/react-query";
import type {
  GetPaymentModeById,
  GetPaymentsMode,
} from "./payment-mode-service";

export function useGetPaymentModeById(id?: string | null) {
  return useQuery({
    queryKey: [useGetPaymentModeById.name, id],
    enabled: !!id,
    queryFn: () =>
      httpClient
        .get<GetPaymentModeById>(`/invoice/payments-mode/${id}`)
        .then((resp) => resp.data),
  });
}

export function useGetPaymentModes() {
  return useQuery({
    queryKey: [useGetPaymentModes.name],
    queryFn: () =>
      httpClient
        .get<GetPaymentsMode>(`/invoice/payments-mode`)
        .then((resp) => resp.data),
  });
}
