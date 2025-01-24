"use client";
import { useRouter } from "next/navigation";
import { GetInvoiceById, GetInvoices } from "./invoice-service";
import dayjs from "dayjs";
import { DataTable } from "@/components/data-table";
import { useSeo } from "@/lib/use-seo";
import { useColumnDefs } from "./components/invoice-colum-defs";
import { routes } from "@/app/routes";
import { DataTableWrapper } from "@/components/data-table-wrapper";

export default function InvoicePage({ invoices }: InvoicePageProps) {
  const { push } = useRouter();
  const { columns } = useColumnDefs();
  useSeo({ title: "Facture" });

  return (
    <DataTableWrapper
      title="Facture"
      cta={{ label: "Ajouter", onClick: () => push(routes.invoiceCreate()) }}
      breadcrumb={[{ label: "Facture" }]}
      count={invoices.results.length}
      emptyProps={{
        title: "Aucune facture",
        description: 'Cliquez sur "Ajouter" pour créer une facture',
      }}
    >
      <DataTable
        initialState={{ pagination: { pageIndex: 0, pageSize: 10 } }}
        data={invoices.results}
        columns={columns}
      />
    </DataTableWrapper>
  );
}

type InvoicePageProps = {
  invoices: GetInvoices;
};

export function invoiceDetaultFilename(invoice: GetInvoiceById) {
  return `${invoice.ref}_${dayjs().format(
    "DDMMYYYY",
  )}_${invoice.Client.name.replace(" ", "-")}.pdf`;
}
