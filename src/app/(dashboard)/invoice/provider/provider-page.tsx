"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { GetProviders } from "./provider-service";
import { useSeo } from "@/lib/use-seo";
import { DataTable } from "@/components/data-table";
import { useColumnDefs } from "./components/provider-column-defs";
import { ProviderSave } from "./components/provider-save";
import { DataTableWrapper } from "@/components/data-table-wrapper";

export function ProviderPage({ providers }: ProviderPageProps) {
  const { refresh } = useRouter();
  const [open, setOpen] = useState(false);
  const { columns } = useColumnDefs();
  useSeo({ title: "Prestataires" });

  return (
    <>
      <DataTableWrapper
        title="Prestataires"
        count={providers.results.length}
        cta={{ label: "Ajouter", onClick: () => setOpen(true) }}
        breadcrumb={[{ label: "Prestataires" }]}
        emptyProps={{
          title: "Aucun prestataire",
          description: 'Cliquez sur "Ajouter" pour créer un prestataire',
        }}
      >
        <DataTable
          data={providers.results}
          columns={columns}
          initialState={{ pagination: { pageIndex: 0, pageSize: 10 } }}
        />
      </DataTableWrapper>
      <ProviderSave open={open} onOpenChange={setOpen} onFinish={refresh} />
    </>
  );
}

type ProviderPageProps = {
  providers: GetProviders;
};
