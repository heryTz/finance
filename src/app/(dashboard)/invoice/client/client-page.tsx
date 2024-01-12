"use client";
import { Block } from "@/components/block";
import { Button } from "@mui/material";
import { Loader } from "@/components/loader";
import { ErrorSection } from "@/components/error-section";
import { useClientDeleteStore, useClientSaveStore } from "./client-store";
import { useColumnDefs } from "./client-util";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useGetInvoiceClient } from "./client-query";
import { ClientSave } from "./components/client-save";
import { ClientDelete } from "./components/client-delete";

export default function ClientPage() {
  const { data, isLoading, error, refetch } = useGetInvoiceClient();
  const { onOpen, reloader } = useClientSaveStore();
  const reloaderDelete = useClientDeleteStore((state) => state.reloader);
  const { columns } = useColumnDefs();

  useEffect(() => {
    if (reloader || reloaderDelete) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloader, reloaderDelete]);

  return (
    <>
      <Block
        title="Mes clients"
        actionBar={<Button onClick={onOpen}>Ajouter</Button>}
      >
        {!data || isLoading ? (
          <Loader />
        ) : error ? (
          <ErrorSection />
        ) : (
          <DataGrid
            rows={data.data.results}
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
      <ClientSave />
      <ClientDelete />
    </>
  );
}
