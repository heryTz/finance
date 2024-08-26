import { humanDate } from "@/lib/humanizer";
import { ColumnDef } from "@tanstack/react-table";
import { ArrayElement } from "@/lib/types";
import { GetPaymentsMode } from "../payment-mode-service";
import { PaymentModeTableAction } from "./payment-mode-table-action";

export function useColumnDefs() {
  const columns: ColumnDef<ArrayElement<GetPaymentsMode["results"]>>[] = [
    { accessorKey: "name", header: "Nom" },
    {
      accessorKey: "createdAt",
      header: "Création",
      cell: (props) => humanDate(props.getValue<string>()),
    },
    {
      accessorKey: "updatedAt",
      header: "Modification",
      cell: (props) => humanDate(props.getValue<string>()),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: (props) => <PaymentModeTableAction row={props.row.original} />,
    },
  ];

  return { columns };
}
