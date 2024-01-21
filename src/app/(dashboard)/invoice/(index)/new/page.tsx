import { apiGuard } from "@/lib/api-guard";
import { getClients } from "../../client/client-service";
import { getPaymentsMode } from "../../payment-mode/payment-service";
import { InvoiceSave } from "../components/invoice-save";
import { getProducts } from "../invoice-service";

export default async function InvoiceNewPage() {
  const { user } = await apiGuard();
  const clients = await getClients();
  const products = await getProducts();
  const paymentsMode = await getPaymentsMode(user.id);
  return (
    <InvoiceSave
      clients={clients}
      products={products}
      paymentsMode={paymentsMode.results}
    />
  );
}
