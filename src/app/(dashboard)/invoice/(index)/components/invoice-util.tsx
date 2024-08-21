import { useInvoiceDeleteStore } from "../invoice-store";
import { humanAmount, humanDate } from "@/lib";
import { TableAction } from "@/components/table-action";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";
import { Box, IconButton, Stack, Tooltip, capitalize } from "@mui/material";
import { Download } from "@mui/icons-material";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { ColumnDef } from "@tanstack/react-table";
import { ArrayElement } from "@/lib/types";
import { GetInvoices } from "../invoice-service";
import { AppTooltip } from "@/components/app-tooltip";
import { InfoIcon } from "lucide-react";
import { InvoiceTableAction } from "./invoice-table-action";

export function getCurrency() {
  return ["Ar", "EUR"] as const;
}
export type Currency = ReturnType<typeof getCurrency>[number];

export function useColumnDefs() {
  const { push } = useRouter();
  const onDelete = useInvoiceDeleteStore((state) => state.onDelete);

  const columns: ColumnDef<ArrayElement<GetInvoices["results"]>>[] = [
    {
      accessorKey: "ref",
      header: "Ref",
      meta: {
        className: "w-[100px]",
      },
    },
    {
      accessorKey: "Client",
      header: "Client",
      meta: {
        className: "w-[300px]",
      },
      cell: (props) => props.row.original.Client.name,
    },
    {
      accessorKey: "productsLength",
      header: "Nb Produits",
      meta: {
        className: "align-right",
      },
      cell: (props) => {
        const count = props.row.original.Products.length;
        return (
          <div className="flex items-center gap-2">
            <span>{count}</span>
            <AppTooltip
              content={props.row.original.Products.map(
                (el: Product) => el.name,
              ).join(", ")}
            >
              <InfoIcon className="w-4 h-4" />
            </AppTooltip>
          </div>
        );
      },
    },
    {
      accessorKey: "Products",
      header: "Total",
      meta: {
        className: "align-right w-[150px]",
      },
      cell: ({ row: { original } }) => {
        const sum = original.Products.reduce(
          (acc: number, cur: Product) => acc + cur.price * cur.qte,
          0,
        );
        return `${humanAmount(sum)} ${original.currency}`;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Création",
      meta: {
        className: "w-[150px]",
      },
      cell: ({ row: { original } }) => humanDate(original.createdAt),
    },
    {
      accessorKey: "updatedAt",
      header: "Modification",
      meta: {
        className: "w-[150px]",
      },
      cell: ({ row: { original } }) => humanDate(original.updatedAt),
    },
    {
      accessorKey: "action",
      header: "Action",
      meta: {
        className: "w-[150px]",
      },
      cell: ({ row: { original } }) => <InvoiceTableAction row={original} />,
    },
  ];

  return { columns };
}

export function defaultInvoiceSubject() {
  const date = dayjs().locale("fr").format("MMMM YYYY");
  return `Facture de mois de ${capitalize(date)}`;
}

export function defaultInvoiceContent(options: { senderName: string }) {
  const date = dayjs().locale("fr").format("MMMM YYYY");
  return `Bonjour,\n\nVoici ma facture du mois de ${capitalize(
    date,
  )}.\n\nCordialement,\n\n${options.senderName}`;
}
