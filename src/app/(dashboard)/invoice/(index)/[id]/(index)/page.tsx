import { InvoiceDocument } from "./components/invoice-document";
import { getInvoiceById } from "../../invoice-service";
import { apiGuard } from "@/lib/api-guard";
import { Metadata } from "next";
import { genTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: genTitle("Génération de facture"),
};

export default async function InvoiceDocumentPage(
  props: InvoiceDocumentPageProps,
) {
  const params = await props.params;
  const { user } = await apiGuard();
  const invoice = await getInvoiceById(user.id, params.id);
  return <InvoiceDocument invoice={invoice} />;
}

type InvoiceDocumentPageProps = {
  params: Promise<{ id: string }>;
};
