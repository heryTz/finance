"use client";
import { useFinances } from "./finance-query";
import { FinanceDelete, FinanceSave } from "./components";
import { useFinanceDeleteStore, useFinanceSaveStore } from "./finance-store";
import { useEffect } from "react";
import { useColumnDefs } from "./finance-util";
import { Loader } from "@/components/loader";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { ErrorSection } from "@/components/error-section";
import { useSeo } from "@/lib/use-seo";
import { FinanceTable } from "./components/finance-table";

export default function FinancePage() {
  const { data, isLoading, error, refetch } = useFinances();
  const { onOpen, reloader } = useFinanceSaveStore();
  const reloaderDelete = useFinanceDeleteStore((state) => state.reloader);
  const { columns } = useColumnDefs();

  useSeo({ title: "List" });

  useEffect(() => {
    if (reloader || reloaderDelete) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloader, reloaderDelete]);

  const stats = data?.data?.stats;

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
        <FinanceTable data={data.data.results} />
      )}
      <FinanceSave />
      <FinanceDelete />
    </Container>
  );
  // return (
  //   <Grid container spacing={3}>
  //     <Grid item xs={12}>
  //       <MiniGlobalBilan
  //         expense={stats?.expense ?? 0}
  //         income={stats?.income ?? 0}
  //       />
  //       <Block
  //         title="Mouvement"
  //         actionBar={<Button onClick={onOpen}>Ajouter</Button>}
  //       >
  //         {isLoading ? (
  //           <Loader />
  //         ) : error ? (
  //           <ErrorSection />
  //         ) : (
  //           <DataGrid
  //             rows={data?.data.results!}
  //             columns={columns}
  //             pageSizeOptions={[20, 40, 60]}
  //             initialState={{
  //               pagination: {
  //                 paginationModel: {
  //                   pageSize: 20,
  //                 },
  //               },
  //               sorting: {
  //                 sortModel: [{ field: "createdAt", sort: "desc" }],
  //               },
  //             }}
  //           />
  //         )}
  //       </Block>
  //     </Grid>
  //     <FinanceSave />
  //     <FinanceDelete />
  //   </Grid>
  // );
}
