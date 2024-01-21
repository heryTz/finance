import { apiGuard } from "@/lib/api-guard";
import { getClients } from "../../client/client-service";
import { getPaymentsMode } from "../../payment-mode/payment-mode-service";
import { InvoiceSave } from "../components/invoice-save";
import { getProducts } from "../invoice-service";

export default async function InvoiceNewPage() {
  const { user } = await apiGuard();
  const clients = await getClients(user.id);
  const products = await getProducts(user.id);
  const paymentsMode = await getPaymentsMode(user.id);
  return (
    <InvoiceSave
      clients={clients}
      products={products}
      paymentsMode={paymentsMode.results}
    />
  );
}
