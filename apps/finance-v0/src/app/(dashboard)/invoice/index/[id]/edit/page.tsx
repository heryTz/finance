import { getInvoiceById, getProducts } from "../../invoice-service";
import { InvoiceSave } from "../../components/invoice-save";
import { guard } from "@/lib/auth";

export default async function InvoiceEditPage(props: InvoiceEditPageProps) {
  const params = await props.params;
  const { user } = await guard();
  const invoice = await getInvoiceById(user.id, params.id);
  const products = await getProducts(user.id);

  return <InvoiceSave products={products} invoice={invoice} />;
}

type InvoiceEditPageProps = {
  params: Promise<{ id: string }>;
};
