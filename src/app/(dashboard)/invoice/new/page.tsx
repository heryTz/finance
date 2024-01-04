import { getClients } from "../client/client-service";
import { InvoiceSaveForm } from "../components/InvoiceSaveForm";
import { getProducts } from "../invoice-service";

export default async function NewInvoice() {
  const clients = await getClients();
  const products = await getProducts();
  return <InvoiceSaveForm clients={clients} products={products} />;
}
