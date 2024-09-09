import { apiGuard } from "@/lib/api-guard";
import { getPaymentsMode } from "../../payment-mode/payment-mode-service";
import { InvoiceSave } from "../components/invoice-save";
import { getProducts } from "../invoice-service";

export default async function InvoiceCreatePage() {
  const { user } = await apiGuard();
  const products = await getProducts(user.id);
  const paymentsMode = await getPaymentsMode(user.id);
  return (
    <InvoiceSave products={products} paymentsMode={paymentsMode.results} />
  );
}
