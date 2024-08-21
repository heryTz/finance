"use client";
import { useRouter } from "next/navigation";
import { GetInvoiceById, GetInvoices } from "../invoice-service";
import { useColumnDefs } from "./invoice-util";
import dayjs from "dayjs";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { useSeo } from "@/lib/use-seo";

export default function InvoiceList({ invoices }: InvoiceListProps) {
  const { push } = useRouter();
  const { columns } = useColumnDefs();
  useSeo({ title: "Facture" });

  return (
    <Container
      title="Finance"
      action={<Button onClick={() => push("/invoice/new")}>Ajouter</Button>}
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
