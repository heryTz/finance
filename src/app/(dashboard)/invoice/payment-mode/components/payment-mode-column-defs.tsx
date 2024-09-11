import { humanDate } from "@/lib/humanizer";
import { ColumnDef } from "@tanstack/react-table";
import { ArrayElement } from "@/lib/types";
import { GetPaymentsMode } from "../payment-mode-service";
import { PaymentModeAction } from "./payment-mode-action";

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
      cell: (props) => <PaymentModeAction row={props.row.original} />,
    },
  ];

  return { columns };
}
