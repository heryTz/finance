import { notFound } from "next/navigation";
import { getInvoiceById, getInvoiceConfig } from "../../invoice-service";
import { InvoiceDocument } from "./components/InvoiceDocument";

export default async function InvoiceDocumentPage({
  params,
}: InvoiceDocumentPageProps) {
  const invoice = await getInvoiceById(params.id);
  if (!invoice) notFound();
  const config = await getInvoiceConfig();
  return <InvoiceDocument invoice={invoice} config={config} />;
}

type InvoiceDocumentPageProps = {
  params: { id: string };
};
