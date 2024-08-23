import ProviderSetup from "../provider/provider-page";
import ClientListing from "../client/client-page";
import { getInvoices } from "./invoice-service";
import PaymentModePage from "../payment-mode/payment-mode-page";
import { getPaymentsMode } from "../payment-mode/payment-mode-service";
import InvoiceList from "./components/invoice-list";
import { apiGuard } from "@/lib/api-guard";
import { AppTab } from "@/components/app-tab";
import { getClients } from "../client/client-service";
import { getProvider } from "../provider/provider-service";

// 🥵 WFT! make "ClientListing", "InvoiceLising", "ProviderSetup" as default export solve this problem
// Element type is invalid. Received a promise that resolves to: undefined. Lazy element type must resolve to a class or function.

// TODO: Make all tabs in different routes and avoid this eager loading

export default async function InvoicePage() {
  const { user } = await apiGuard();
  const invoices = await getInvoices(user.id);
  const paymentsMode = await getPaymentsMode(user.id);
  const clients = await getClients(user.id);
  const provider = await getProvider(user.id);

  return (
    <AppTab
      tabs={[
        {
          name: "invoice",
          title: "Facture",
          component: <InvoiceList invoices={invoices} />,
        },
        {
          name: "client",
          title: "Client",
          component: <ClientListing clients={clients} />,
        },
        {
          name: "provider",
          title: "Prestataire",
          component: <ProviderSetup provider={provider} />,
        },
        {
          name: "payment-mode",
          title: "Mode de paiement",
          component: <PaymentModePage paymentsMode={paymentsMode} />,
        },
      ]}
    />
  );
}
