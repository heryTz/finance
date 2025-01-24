"use client";

import { useColumnDefs } from "./components/client-column-defs";
import { GetClients } from "./client-service";
import { useSeo } from "@/lib/use-seo";
import { DataTable } from "@/components/data-table";
import { useState } from "react";
import { ClientSave } from "./components/client-save";
import { useRouter } from "next/navigation";
import { DataTableWrapper } from "@/components/data-table-wrapper";

export default function ClientPage({ clients }: ClientPageProps) {
  const { refresh } = useRouter();
  const [open, setOpen] = useState(false);
  const { columns } = useColumnDefs();
  useSeo({ title: "Clients" });

  return (
    <>
      <DataTableWrapper
        title="Clients"
        count={clients.results.length}
        cta={{ label: "Ajouter", onClick: () => setOpen(true) }}
        breadcrumb={[{ label: "Clients" }]}
        emptyProps={{
          title: "Aucun client",
          description: 'Cliquez sur "Ajouter" pour créer un client',
        }}
      >
        <DataTable
          data={clients.results}
          columns={columns}
          initialState={{ pagination: { pageIndex: 0, pageSize: 10 } }}
        />
      </DataTableWrapper>
      <ClientSave open={open} onOpenChange={setOpen} onFinish={refresh} />
    </>
  );
}

type ClientPageProps = {
  clients: GetClients;
};
