"use client";
import { useFinances } from "./finance-query";
import { useState } from "react";
import { Loader } from "@/components/loader";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { ErrorSection } from "@/components/error-section";
import { useSeo } from "@/lib/use-seo";
import { useFinanceColumnDefs } from "./components/finance-column-defs";
import { DataTable } from "@/components/data-table";
import { FinanceSave } from "./components/finance-save";

export default function FinancePage() {
  const { data, isLoading, error, refetch } = useFinances();
  const { columns } = useFinanceColumnDefs();
  const [openSave, setOpenSave] = useState(false);

  useSeo({ title: "List" });

  return (
    <Container
      title="Finance"
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
        <FinanceSave
          open={openSave}
          onOpenChange={setOpenSave}
          onFinish={refetch}
        />
      )}
    </Container>
  );
}
