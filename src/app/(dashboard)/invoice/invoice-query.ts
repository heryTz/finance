import { SaveInvoiceConfigInput } from "@/app/api/v1/invoice/config/route";
import { httpClient } from "@/app/helper";
import { InvoiceConfig } from "@prisma/client";
import { useMutation, useQuery } from "react-query";

export function useInvoiceConfigSave() {
  return useMutation("invoice.config.save", (data: SaveInvoiceConfigInput) =>
    httpClient.post<InvoiceConfig>("/invoice/config", data)
  );
}

export function useInvoiceConfig() {
  return useQuery("invoice.config", () =>
    httpClient.get<InvoiceConfig>("/invoice/config")
  );
}
