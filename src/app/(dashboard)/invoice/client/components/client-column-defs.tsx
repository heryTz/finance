import { humanDate } from "@/lib";
import { ColumnDef } from "@tanstack/react-table";
import { ArrayElement } from "@/lib/types";
import { GetClients } from "../client-service";
import { ClientAction } from "./client-action";

export function useColumnDefs() {
  const columns: ColumnDef<ArrayElement<GetClients["results"]>>[] = [
    { accessorKey: "ref", header: "Ref", meta: { className: "w-[100px]" } },
    { accessorKey: "name", header: "Nom", meta: { className: "w-[400px]" } },
    { accessorKey: "email", header: "Email", meta: { className: "w-[250px]" } },
    {
      accessorKey: "createdAt",
      header: "Création",
      meta: { className: "w-[150px]" },
      cell: (props) => humanDate(props.getValue<string>()),
    },
    {
      accessorKey: "action",
      header: "Action",
      meta: { className: "w-[100px]" },
      cell: (props) => <ClientAction row={props.row.original} />,
    },
  ];

  return { columns };
}
