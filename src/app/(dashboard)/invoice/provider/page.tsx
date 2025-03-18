import { guard } from "@/lib/auth";
import { getProviders } from "../provider/provider-service";
import { Suspense } from "react";
import { Loader } from "@/components/loader";
import { ProviderPage } from "./provider-page";

export default async function Page() {
  const { user } = await guard();
  const providers = await getProviders(user.id);

  return (
    <Suspense fallback={<Loader />}>
      <ProviderPage providers={providers} />
    </Suspense>
  );
}
