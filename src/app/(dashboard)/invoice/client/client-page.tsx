"use client";

import { useColumnDefs } from "./components/client-column-defs";
import { GetClients } from "./client-service";
import { useSeo } from "@/lib/use-seo";
import { Container } from "@/components/container";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ClientSave } from "./components/client-save";
import { useRouter } from "next/navigation";

export default function ClientPage({ clients }: ClientPageProps) {
  const { refresh } = useRouter();
  const [open, setOpen] = useState(false);
  const { columns } = useColumnDefs();
  useSeo({ title: "Clients" });

  return (
    <>
      <Container
        title="Clients"
        action={<Button onClick={() => setOpen(true)}>Ajouter</Button>}
      >
        <DataTable data={clients.results} columns={columns} />
      </Container>
      <ClientSave open={open} onOpenChange={setOpen} onFinish={refresh} />
    </>
  );
}

type ClientPageProps = {
  clients: GetClients;
};
