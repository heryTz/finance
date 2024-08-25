import { InvoiceDocument } from "./components/invoice-document";
import { getInvoiceById } from "../../invoice-service";
import { getProvider } from "../../../provider/provider-service";
import { apiGuard } from "@/lib/api-guard";
import { Empty } from "@/components/empty";
import { Metadata } from "next";
import { genTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: genTitle("Génération de facture"),
};

export default async function InvoiceDocumentPage({
  params,
}: InvoiceDocumentPageProps) {
  const { user } = await apiGuard();
  const invoice = await getInvoiceById(user.id, params.id);
  const provider = await getProvider(user.id);
  if (!provider) {
    return (
      <Empty
        title="Prestataire non configuré"
        description="Vous devez configurer le prestataire de votre facture."
        cta={{ href: "/invoice?tab=2", label: "Configurer" }}
      />
    );
  }
  return <InvoiceDocument invoice={invoice} provider={provider} />;
}

type InvoiceDocumentPageProps = {
  params: { id: string };
};
