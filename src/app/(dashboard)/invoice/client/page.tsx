import { guard } from "@/lib/auth";
import { getClients } from "../client/client-service";
import { Suspense } from "react";
import { Loader } from "@/components/loader";
import { ClientPage } from "./client-page";

export default async function Page() {
  const { user } = await guard();
  const clients = await getClients(user.id);

  return (
    <Suspense fallback={<Loader />}>
      <ClientPage clients={clients} />
    </Suspense>
  );
}
