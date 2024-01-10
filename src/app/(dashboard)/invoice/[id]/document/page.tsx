import { notFound } from "next/navigation";
import { getInvoiceById } from "../../(index)/invoice-service";
import { InvoiceDocument } from "./components/invoice-document";
import { getProvider } from "../../provider/provider-service";

export default async function InvoiceDocumentPage({
  params,
}: InvoiceDocumentPageProps) {
  const invoice = await getInvoiceById(params.id);
  if (!invoice) notFound();
  const provider = await getProvider();
  return <InvoiceDocument invoice={invoice} provider={provider} />;
}

type InvoiceDocumentPageProps = {
  params: { id: string };
};
