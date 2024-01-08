"use client";
import { GetPaymentsMode } from "./payments-service";
import { useColumnDefs } from "./payments-mode-util";
import { Block } from "@/components/block";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { PaymentsModeSave } from "./payments-mode-save";
import { PaymentsModeDelete } from "./payments-mode-delete";
import { usePaymentsModeSaveStore } from "./payments-mode-store";

export default function PaymentsModeListing({
  paymentsMode,
}: PaymentsModeProps) {
  const { columns } = useColumnDefs();
  const { onOpen } = usePaymentsModeSaveStore();

  return (
    <>
      <Block
        title="Mes mode de paiements"
        actionBar={<Button onClick={onOpen}>Ajouter</Button>}
      >
        <DataGrid
          rows={paymentsMode.results}
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
      <PaymentsModeSave />
      <PaymentsModeDelete />
    </>
  );
}

type PaymentsModeProps = {
  paymentsMode: GetPaymentsMode;
};
