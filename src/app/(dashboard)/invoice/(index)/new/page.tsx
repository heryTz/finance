import { getClients } from "../../client/client-service";
import { getPaymentsMode } from "../../payment-mode/payment-service";
import { InvoiceSave } from "../components/invoice-save";
import { getProducts } from "../invoice-service";


export default async function NewInvoice() {
  const clients = await getClients();
  const products = await getProducts();
  const paymentsMode = await getPaymentsMode();
  return (
    <InvoiceSave
      clients={clients}
      products={products}
      paymentsMode={paymentsMode.results}
    />
  );
}
