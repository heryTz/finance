import ProviderSetup from "../provider/provider-page";
import ClientListing from "../client/client-page";
import { getInvoices } from "./invoice-service";
import { InvoiceTab } from "./components/invoice-tab";
import PaymentsModeListing from "../payment-mode/payment-mode-page";
import { getPaymentsMode } from "../payment-mode/payment-service";
import InvoiceList from "./components/invoice-list";

// 🥵 WFT! make "ClientListing", "InvoiceLising", "ProviderSetup" as default export solve this problem
// Element type is invalid. Received a promise that resolves to: undefined. Lazy element type must resolve to a class or function.

export default async function InvoicePage() {
  const invoices = await getInvoices();
  const paymentsMode = await getPaymentsMode();

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
          component: <PaymentsModeListing paymentsMode={paymentsMode} />,
        },
      ]}
    />
  );
}
