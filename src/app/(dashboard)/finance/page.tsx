"use client";
import { Block } from "@/components/block";
import { Box, Button, Chip, Grid } from "@mui/material";
import { useFinances } from "./finance-query";
import { ErrorSection } from "@/components/error-section";
import { FinanceListLoader, FinanceSaveDialog } from "./components";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Dot } from "@/components/dot";
import { bilanGlobal, humanAmount, humanDate } from "@/app/helper";
import { MiniGlobalBilan } from "@/components/mini-global-bilan";
import { useFinanceSaveStore } from "./finance-store";
import { Tag } from "@prisma/client";
import { useEffect } from "react";

export default function Finance() {
  const { data, isLoading, error, refetch } = useFinances();
  const { onOpen, finishReloader } = useFinanceSaveStore();

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
              }}
            />
          )}
        </Block>
      </Grid>
      <FinanceSaveDialog />
    </Grid>
  );
}

const columns: GridColDef[] = [
  { field: "label", headerName: "Libellé", width: 350 },
  {
    field: "type",
    headerName: "Type",
    width: 100,
    renderCell: (params) => (
      <Dot color={params.value === "depense" ? "lightpink" : "lightgreen"} />
    ),
  },
  {
    field: "amount",
    headerName: "Montant",
    width: 100,
    align: "right",
    renderCell: (params) => humanAmount(params.value),
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 250,
    renderCell: (params) => (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {(params.value as Tag[]).map((el) => (
          <Chip key={el.name} label={el.name} size="small" />
        ))}
      </Box>
    ),
  },
  {
    field: "createdAt",
    headerName: "Création",
    width: 100,
    renderCell: (params) => humanDate(params.value),
  },
  {
    field: "updatedAt",
    headerName: "Modification",
    width: 100,
    renderCell: (params) => humanDate(params.value),
  },
];
