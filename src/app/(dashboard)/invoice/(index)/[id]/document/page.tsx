import { InvoiceDocument } from "./components/invoice-document";
import { getInvoiceById } from "../../invoice-service";
import { getProvider } from "../../../provider/provider-service";
import { apiGuard } from "@/lib/api-guard";
import { AlertPage } from "@/components/alert-page";

export default async function InvoiceDocumentPage({
  params,
}: InvoiceDocumentPageProps) {
  const { user } = await apiGuard();
  const invoice = await getInvoiceById(user.id, params.id);
  const provider = await getProvider(user.id);
  if (!provider) {
    return (
      <AlertPage
        title="Prestataire non configuré"
        message="Vous devez configurer le prestataire de votre facture."
        action={{ href: "/invoice?tab=2", label: "Configurer" }}
      />
    );
  }
  return <InvoiceDocument invoice={invoice} provider={provider} />;
}

type InvoiceDocumentPageProps = {
  params: { id: string };
};
