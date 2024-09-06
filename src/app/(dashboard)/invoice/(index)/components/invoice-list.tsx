"use client";
import { useRouter } from "next/navigation";
import { GetInvoiceById, GetInvoices } from "../invoice-service";
import dayjs from "dayjs";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { useSeo } from "@/lib/use-seo";
import { useColumnDefs } from "./invoice-colum-defs";
import { routes } from "@/app/routes";

export default function InvoiceList({ invoices }: InvoiceListProps) {
  const { push } = useRouter();
  const { columns } = useColumnDefs();
  useSeo({ title: "Facture" });

  return (
    <Container
      title="Facture"
      action={
        <Button onClick={() => push(routes.invoiceCreate())}>Ajouter</Button>
      }
      breadcrumb={[{ label: "Facture" }]}
    >
      <DataTable data={invoices.results} columns={columns} />
    </Container>
  );
}

type InvoiceListProps = {
  invoices: GetInvoices;
};

export function invoiceDetaultFilename(invoice: GetInvoiceById) {
  return `${invoice.ref}_${dayjs().format(
    "DDMMYYYY",
  )}_${invoice.Client.name.replace(" ", "-")}.pdf`;
}
