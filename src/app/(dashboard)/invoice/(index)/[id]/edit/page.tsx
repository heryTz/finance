import { getInvoiceById, getProducts } from "../../invoice-service";
import { getClients } from "../../../client/client-service";
import { getPaymentsMode } from "../../../payment-mode/payment-mode-service";
import { InvoiceSave } from "../../components/invoice-save";
import { apiGuard } from "@/lib/api-guard";

export default async function InvoiceEditPage({
  params,
}: InvoiceEditPageProps) {
  const { user } = await apiGuard();
  const invoice = await getInvoiceById(user.id, params.id);
  const clients = await getClients(user.id);
  const products = await getProducts(user.id);
  const paymentsMode = await getPaymentsMode(user.id);

  return (
    <InvoiceSave
      clients={clients}
      products={products}
      paymentsMode={paymentsMode.results}
      invoice={invoice}
    />
  );
}

type InvoiceEditPageProps = {
  params: { id: string };
};
