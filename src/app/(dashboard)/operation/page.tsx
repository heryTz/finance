"use client";
import { useGetOperations } from "./operation-query";
import { useState } from "react";
import { Loader } from "@/components/loader";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { ErrorSection } from "@/components/error-section";
import { useSeo } from "@/lib/use-seo";
import { useOperationColumnDefs } from "./components/operation-column-defs";
import { DataTable } from "@/components/data-table";
import { OperationSave } from "./components/operation-save";

export default function OperationPage() {
  const { data, isLoading, error, refetch } = useGetOperations();
  const { columns } = useOperationColumnDefs();
  const [openSave, setOpenSave] = useState(false);

  useSeo({ title: "Opération" });

  return (
    <Container
      title="Opération"
      action={<Button onClick={() => setOpenSave(true)}>Ajouter</Button>}
      breadcrumb={[{ label: "Opération" }]}
    >
      {isLoading ? (
        <Loader />
      ) : error || !data ? (
        <ErrorSection />
      ) : (
        <DataTable data={data.data.results} columns={columns} />
      )}
      <OperationSave
        open={openSave}
        onOpenChange={setOpenSave}
        onFinish={refetch}
      />
    </Container>
  );
}
