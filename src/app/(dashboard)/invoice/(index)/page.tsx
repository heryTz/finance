import ProviderSetup from "../provider/provider-page";
import ClientListing from "../client/client-page";
import { getInvoices } from "./invoice-service";
import { InvoiceTab } from "./components/invoice-tab";
import PaymentModePage from "../payment-mode/payment-mode-page";
import { getPaymentsMode } from "../payment-mode/payment-mode-service";
import InvoiceList from "./components/invoice-list";
import { apiGuard } from "@/lib/api-guard";

// 🥵 WFT! make "ClientListing", "InvoiceLising", "ProviderSetup" as default export solve this problem
// Element type is invalid. Received a promise that resolves to: undefined. Lazy element type must resolve to a class or function.

export default async function InvoicePage() {
  const { user } = await apiGuard();
  const invoices = await getInvoices(user.id);
  const paymentsMode = await getPaymentsMode(user.id);

  return (
    <InvoiceTab
      tabs={[
        {
          index: 0,
          title: "Facture",
          component: <InvoiceList invoices={invoices} />,
        },
        { index: 1, title: "Client", component: <ClientListing /> },
        { index: 2, title: "Prestataire", component: <ProviderSetup /> },
        {
          index: 3,
          title: "Mode de paiement",
          component: <PaymentModePage paymentsMode={paymentsMode} />,
        },
      ]}
    />
  );
}
