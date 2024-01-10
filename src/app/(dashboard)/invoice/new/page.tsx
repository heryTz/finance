import { getClients } from "../client/client-service";
import { InvoiceSaveForm } from "../components/invoice-save-form";
import { getProducts } from "../invoice-service";
import { getPaymentsMode } from "../payments-mode/payments-service";

export default async function NewInvoice() {
  const clients = await getClients();
  const products = await getProducts();
  const paymentsMode = await getPaymentsMode();
  return (
    <InvoiceSaveForm
      clients={clients}
      products={products}
      paymentsMode={paymentsMode.results}
    />
  );
}
