import { ArrayElement } from "@/lib/types";
import { GetFinances } from "../finance-service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { FinanceSave } from "./finance-save";
import { useQueryClient } from "react-query";
import { useFinanceDelete, useFinances } from "../finance-query";
import { ModalDelete } from "@/components/modal-delete";

export function FinanceAction({ row }: FinanceActionProps) {
  const queryClient = useQueryClient();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const deleteFn = useFinanceDelete();

  const onRefetch = () => {
    queryClient.refetchQueries({ queryKey: [useFinances.name] });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            Editer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {openEdit && (
        <FinanceSave
          idToEdit={row.id}
          open={openEdit}
          onOpenChange={setOpenEdit}
          onFinish={onRefetch}
        />
      )}
      {openDelete && (
        <ModalDelete
          open={openDelete}
          onOpenChange={setOpenDelete}
          label={row.label}
          onDelete={async () => {
            await deleteFn.mutateAsync(row.id);
            onRefetch();
          }}
        />
      )}
    </>
  );
}

type FinanceActionProps = {
  row: ArrayElement<GetFinances["results"]>;
};
