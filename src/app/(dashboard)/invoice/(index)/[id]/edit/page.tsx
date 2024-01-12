import { notFound } from "next/navigation";
import { getInvoiceById, getProducts } from "../../invoice-service";
import { getClients } from "../../../client/client-service";
import { getPaymentsMode } from "../../../payment-mode/payment-service";
import { InvoiceSave } from "../../components/invoice-save";

export default async function InvoiceEditPage({
  params,
}: InvoiceEditPageProps) {
  const invoice = await getInvoiceById(params.id);
  if (!invoice) notFound();

  const clients = await getClients();
  const products = await getProducts();
  const paymentsMode = await getPaymentsMode();

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
