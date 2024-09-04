"use client";
import { GetPaymentsMode } from "./payment-mode-service";
import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { useColumnDefs } from "./components/payment-mode-column-defs";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/use-seo";
import { useRouter } from "next/navigation";
import { PaymentModeSave } from "./components/payment-mode-save";

export default function PaymentModePage({ paymentsMode }: PaymentsModeProps) {
  const router = useRouter();
  const { columns } = useColumnDefs();
  const [openSave, setOpenSave] = useState(false);
  useSeo({ title: "Mode de paiements" });

  return (
    <>
      <Container
        title="Mode de paiements"
        action={<Button onClick={() => setOpenSave(true)}>Ajouter</Button>}
      >
        <DataTable data={paymentsMode.results} columns={columns} />
      </Container>
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
