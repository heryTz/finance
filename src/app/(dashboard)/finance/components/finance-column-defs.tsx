import { ArrayElement } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { GetFinances } from "../finance-service";
import { FinanceType } from "@/entity";
import { Dot } from "@/components/dot";
import { humanAmount, humanDate } from "@/lib";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useFinanceDeleteStore, useFinanceSaveStore } from "../finance-store";

export function useFinanceColumnDefs() {
  const onUpdate = useFinanceSaveStore((state) => state.onUpdate);
  const onDelete = useFinanceDeleteStore((state) => state.onDelete);

  const columns: ColumnDef<ArrayElement<GetFinances["results"]>>[] = [
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
        return props.getValue() === FinanceType.depense ? (
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
      cell(props) {
        return humanDate(props.getValue() as string);
      },
    },
    {
      accessorKey: "action",
      header: "",
      cell(props) {
        const row = props.row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onUpdate(row.id)}>
                Editer
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  onDelete({
                    id: row.id,
                    label: row.label,
                  })
                }
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return { columns };
}
