"use client";
import { GetPaymentsMode } from "./payment-mode-service";
import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { useColumnDefs } from "./components/payment-mode-column-defs";
import { useSeo } from "@/lib/use-seo";
import { useRouter } from "next/navigation";
import { PaymentModeSave } from "./components/payment-mode-save";
import { DataTableWrapper } from "@/components/data-table-wrapper";

export default function PaymentModePage({ paymentsMode }: PaymentsModeProps) {
  const router = useRouter();
  const { columns } = useColumnDefs();
  const [openSave, setOpenSave] = useState(false);
  useSeo({ title: "Mode de paiements" });

  return (
    <>
      <DataTableWrapper
        title="Mode de paiements"
        count={paymentsMode.results.length}
        cta={{ label: "Ajouter", onClick: () => setOpenSave(true) }}
        breadcrumb={[{ label: "Mode de paiements" }]}
        emptyProps={{
          title: "Aucun mode de paiements",
          description: 'Cliquez sur "Ajouter" pour créer un mode de paiements',
        }}
      >
        <DataTable
          data={paymentsMode.results}
          columns={columns}
          initialState={{ pagination: { pageIndex: 0, pageSize: 10 } }}
        />
      </DataTableWrapper>
      <PaymentModeSave
        open={openSave}
        onOpenChange={setOpenSave}
        onFinish={router.refresh}
      />
    </>
  );
}

type PaymentsModeProps = {
  paymentsMode: GetPaymentsMode;
};
