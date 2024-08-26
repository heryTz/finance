import { ArrayElement } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { GetOperations } from "../operation-service";
import { OperationType } from "@/entity/operation";
import { Dot } from "@/components/dot";
import { humanAmount, humanDate } from "@/lib/humanizer";
import { Badge } from "@/components/ui/badge";
import { OperationAction } from "./operation-action";

export function useOperationColumnDefs() {
  const columns: ColumnDef<ArrayElement<GetOperations["results"]>>[] = [
    {
      accessorKey: "label",
      header: "Libellé",
      meta: {
        className: "w-[350px]",
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      meta: {
        className: "w-[150px] text-center",
      },
      cell(props) {
        return props.getValue() === OperationType.depense ? (
          <Dot className="bg-destructive" />
        ) : (
          <Dot className="bg-success" />
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Montant",
      meta: {
        className: "w-[200px] text-right",
      },
      cell(props) {
        return humanAmount(props.getValue() as number);
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      meta: {
        className: "w-[300px]",
      },
      cell(props) {
        return (
          <div className="flex items-center gap-2">
            {props.row.original.tags.map((el) => (
              <Badge variant={"secondary"} key={el.id}>
                {el.name}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Création",
      meta: {
        className: "min-w-[200px]",
      },
      cell(props) {
        return humanDate(props.getValue() as string);
      },
    },
    {
      accessorKey: "action",
      header: "",
      cell(props) {
        return <OperationAction row={props.row.original} />;
      },
    },
  ];

  return { columns };
}
