"use client";
import { GetPaymentsMode } from "./payment-service";
import { useColumnDefs } from "./payment-mode-util";
import { Block } from "@/components/block";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { PaymentsModeSave } from "./components/payment-mode-save";
import { PaymentsModeDelete } from "./components/payment-mode-delete";
import { usePaymentsModeSaveStore } from "./payment-mode-store";

export default function PaymentModePage({
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
