import { notFound } from "next/navigation";
import { getInvoiceById, getProducts } from "../../invoice-service";
import { getClients } from "../../client/client-service";
import { getPaymentsMode } from "../../payments-mode/payments-service";
import { InvoiceSaveForm } from "../../components/InvoiceSaveForm";

export default async function EditInvoice({ params }: EditInvoiceProps) {
  const invoice = await getInvoiceById(params.id);
  if (!invoice) notFound();

  const clients = await getClients();
  const products = await getProducts();
  const paymentsMode = await getPaymentsMode();

  return (
    <InvoiceSaveForm
      clients={clients}
      products={products}
      paymentsMode={paymentsMode.results}
      invoice={invoice}
    />
  );
}

type EditInvoiceProps = {
  params: { id: string };
};
