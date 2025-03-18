import { getInvoices } from "./invoice-service";
import { InvoicePage } from "./invoice-page";
import { guard } from "@/lib/auth";
import { Suspense } from "react";
import { Loader } from "@/components/loader";

export default async function Page() {
  const { user } = await guard();
  const invoices = await getInvoices(user.id);

  return (
    <Suspense fallback={<Loader />}>
      <InvoicePage invoices={invoices} />
    </Suspense>
  );
}
