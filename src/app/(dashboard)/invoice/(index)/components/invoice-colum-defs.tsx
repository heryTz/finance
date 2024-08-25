import { AppTooltip } from "@/components/app-tooltip";
import { humanAmount, humanDate } from "@/lib/humanizer";
import { ArrayElement } from "@/lib/types";
import { Product } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { InfoIcon } from "lucide-react";
import { GetInvoices } from "../invoice-service";
import { InvoiceTableAction } from "./invoice-table-action";

export function useColumnDefs() {
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
        className: "w-[150px]",
      },
      cell: ({ row: { original } }) => {
        const sum = original.Products.reduce(
          (acc: number, cur: Product) => acc + cur.price * cur.qte,
          0,
        );
        return `${humanAmount(sum)} ${original.currency} `;
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
