import { guard } from "@/lib/auth";
import { InvoiceSave } from "../components/invoice-save";
import { getProducts } from "../invoice-service";

export default async function InvoiceCreatePage() {
  const { user } = await guard();
  const products = await getProducts(user.id);
  return <InvoiceSave products={products} />;
}
