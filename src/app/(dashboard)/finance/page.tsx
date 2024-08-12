"use client";
import { useFinances } from "./finance-query";
import { FinanceDelete, FinanceSave } from "./components";
import { useFinanceDeleteStore, useFinanceSaveStore } from "./finance-store";
import { useEffect } from "react";
import { Loader } from "@/components/loader";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { ErrorSection } from "@/components/error-section";
import { useSeo } from "@/lib/use-seo";
import { useFinanceColumnDefs } from "./components/finance-column-defs";
import { DataTable } from "@/components/data-table";

export default function FinancePage() {
  const { data, isLoading, error, refetch } = useFinances();
  const { onOpen, reloader } = useFinanceSaveStore();
  const reloaderDelete = useFinanceDeleteStore((state) => state.reloader);
  const { columns } = useFinanceColumnDefs();

  useSeo({ title: "List" });

  useEffect(() => {
    if (reloader || reloaderDelete) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloader, reloaderDelete]);

  return (
    <Container
      title="Finance"
      action={<Button onClick={onOpen}>Ajouter</Button>}
    >
      {isLoading ? (
        <Loader />
      ) : error || !data ? (
        <ErrorSection />
      ) : (
        <DataTable data={data.data.results} columns={columns} />
      )}
      <FinanceSave />
      <FinanceDelete />
    </Container>
  );
}
