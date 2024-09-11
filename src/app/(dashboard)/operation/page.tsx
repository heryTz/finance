"use client";
import { useGetOperations } from "./operation-query";
import { useState } from "react";
import { useSeo } from "@/lib/use-seo";
import { useOperationColumnDefs } from "./components/operation-column-defs";
import { DataTable } from "@/components/data-table";
import { OperationSave } from "./components/operation-save";
import { DataTableWrapper } from "@/components/data-table-wrapper";

export default function OperationPage() {
  const { data, isLoading, error, refetch } = useGetOperations();
  const { columns } = useOperationColumnDefs();
  const [openSave, setOpenSave] = useState(false);

  useSeo({ title: "Opération" });

  return (
    <>
      <DataTableWrapper
        title="Opération"
        count={data?.results.length ?? 0}
        cta={{ label: "Ajouter", onClick: () => setOpenSave(true) }}
        breadcrumb={[{ label: "Opération" }]}
        loading={isLoading}
        error={error}
        emptyProps={{
          title: "Aucune opération",
          description: 'Cliquez sur "Ajouter" pour créer une opération',
        }}
      >
        <DataTable data={data?.results ?? []} columns={columns} />
      </DataTableWrapper>
      <OperationSave
        open={openSave}
        onOpenChange={setOpenSave}
        onFinish={refetch}
      />
    </>
  );
}
