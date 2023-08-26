"use client";
import { Block } from "@/components/block";
import { Button, Grid } from "@mui/material";
import { useFinances } from "./finance-query";
import { ErrorSection } from "@/components/error-section";
import { FinanceListLoader, FinanceSaveDialog } from "./components";
import { DataGrid } from "@mui/x-data-grid";
import { bilanGlobal } from "@/app/helper";
import { MiniGlobalBilan } from "@/components/mini-global-bilan";
import { useFinanceSaveStore } from "./finance-store";
import { useEffect } from "react";
import { useColumnDefs } from "./finance-util";

export default function Finance() {
  const { data, isLoading, error, refetch } = useFinances();
  const { onOpen, finishReloader } = useFinanceSaveStore();
  const { columns } = useColumnDefs();

  useEffect(() => {
    if (finishReloader) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishReloader]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MiniGlobalBilan {...bilanGlobal(data?.data.results ?? [])} />
        <Block
          title="Mouvement"
          actionBar={<Button onClick={onOpen}>Ajouter</Button>}
        >
          {isLoading ? (
            <FinanceListLoader />
          ) : error ? (
            <ErrorSection />
          ) : (
            <DataGrid
              rows={data?.data.results!}
              columns={columns}
              pageSizeOptions={[20, 40, 60]}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 20,
                  },
                },
                sorting: {
                  sortModel: [{ field: "createdAt", sort: "desc" }],
                },
              }}
            />
          )}
        </Block>
      </Grid>
      <FinanceSaveDialog />
    </Grid>
  );
}
