import { humanDate } from "@/lib/humanizer";
import { ColumnDef } from "@tanstack/react-table";
import { ArrayElement } from "@/lib/types";
import { GetProviders } from "../provider-service";
import { ProviderAction } from "./provider-action";

export function useColumnDefs() {
  const columns: ColumnDef<ArrayElement<GetProviders["results"]>>[] = [
    { accessorKey: "name", header: "Nom", meta: { className: "w-[400px]" } },
    { accessorKey: "email", header: "Email", meta: { className: "w-[250px]" } },
    {
      accessorKey: "phone",
      header: "Téléphone",
    },
    {
      accessorKey: "address",
      header: "Adresse",
    },
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
      cell: (props) => <ProviderAction row={props.row.original} />,
    },
  ];

  return { columns };
}
