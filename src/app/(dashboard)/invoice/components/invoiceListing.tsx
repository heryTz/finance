"use client";
import { Block } from "@/components/block";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { GetInvoices } from "../invoice-service";
import { DataGrid } from "@mui/x-data-grid";
import { useColumnDefs } from "../invoice-util";

export default function InvoiceListing({ invoices }: InvoiceListingProps) {
  const { push } = useRouter();
  const { columns } = useColumnDefs();
  return (
    <Block
      title="Mes factures"
      actionBar={<Button onClick={() => push("/invoice/new")}>Ajouter</Button>}
    >
      <DataGrid
        rows={invoices.results}
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
    </Block>
  );
}

type InvoiceListingProps = {
  invoices: GetInvoices;
};
