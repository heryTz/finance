import ConfigListing from "./config/configListing";
import ClientListing from "./client/clientListing";
import InvoiceListing from "./components/invoiceListing";
import { getInvoices } from "./invoice-service";
import { InvoiceTab } from "./components/InvoiceTab";

// 🥵 WFT! make "ClientListing", "InvoiceLising", "ConfigListing" as default export solve this problem
// Element type is invalid. Received a promise that resolves to: undefined. Lazy element type must resolve to a class or function.

export default async function InvoicePage() {
  const invoices = await getInvoices();

  return (
    <InvoiceTab
      tabs={[
        {
          index: 0,
          title: "Facture",
          component: <InvoiceListing invoices={invoices} />,
        },
        { index: 1, title: "Client", component: <ClientListing /> },
        { index: 2, title: "Configuration", component: <ConfigListing /> },
      ]}
    />
  );
}
