"use client";
import { useOperations } from "./operation-query";
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
  const { data, isLoading, error, refetch } = useOperations();
  const { columns } = useOperationColumnDefs();
  const [openSave, setOpenSave] = useState(false);

  useSeo({ title: "List" });

  return (
    <Container
      title="Opération"
      action={<Button onClick={() => setOpenSave(true)}>Ajouter</Button>}
    >
      {isLoading ? (
        <Loader />
      ) : error || !data ? (
        <ErrorSection />
      ) : (
        <DataTable data={data.data.results} columns={columns} />
      )}
      {openSave && (
        <OperationSave
          open={openSave}
          onOpenChange={setOpenSave}
          onFinish={refetch}
        />
      )}
    </Container>
  );
}
