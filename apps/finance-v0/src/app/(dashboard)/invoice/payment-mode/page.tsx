import { getPaymentsMode } from "../payment-mode/payment-mode-service";
import { guard } from "@/lib/auth";
import { Suspense } from "react";
import { Loader } from "@/components/loader";
import PaymentModePage from "./payment-mode-page";

export default async function Page() {
  const { user } = await guard();
  const paymentsMode = await getPaymentsMode(user.id);

  return (
    <Suspense fallback={<Loader />}>
      <PaymentModePage paymentsMode={paymentsMode} />
    </Suspense>
  );
}
