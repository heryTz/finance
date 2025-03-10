import ProvidePage from "../provider/provider-page";
import ClientPage from "../client/client-page";
import { getInvoices } from "./invoice-service";
import PaymentModePage from "../payment-mode/payment-mode-page";
import { getPaymentsMode } from "../payment-mode/payment-mode-service";
import InvoicePage from "./invoice-page";
import { guard } from "@/lib/auth";
import { AppTab } from "@/components/app-tab";
import { getClients } from "../client/client-service";
import { getProviders } from "../provider/provider-service";

// 🥵 WFT! make "ClientPage", "InvoiceLising", "ProvidePage" as default export solve this problem
// Element type is invalid. Received a promise that resolves to: undefined. Lazy element type must resolve to a class or function.

// TODO: Make all tabs in different routes and avoid this eager loading

export default async function Page() {
  const { user } = await guard();
  const invoices = await getInvoices(user.id);
  const paymentsMode = await getPaymentsMode(user.id);
  const clients = await getClients(user.id);
  const providers = await getProviders(user.id);

  return (
    <AppTab
      tabs={[
        {
          name: "invoice",
          title: "Facture",
          component: <InvoicePage invoices={invoices} />,
        },
        {
          name: "client",
          title: "Client",
          component: <ClientPage clients={clients} />,
        },
        {
          name: "provider",
          title: "Prestataire",
          component: <ProvidePage providers={providers} />,
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
