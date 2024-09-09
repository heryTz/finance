import { apiGuard } from "@/lib/api-guard";
import { InvoiceSave } from "../components/invoice-save";
import { getProducts } from "../invoice-service";

export default async function InvoiceCreatePage() {
  const { user } = await apiGuard();
  const products = await getProducts(user.id);
  return <InvoiceSave products={products} />;
}
