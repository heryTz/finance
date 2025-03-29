import { ArrayElement } from "@/lib/types";
import { GetOperations } from "../operation-service";
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
import { OperationSave } from "./operation-save";
import { useQueryClient } from "@tanstack/react-query";
import { ModalDelete } from "@/components/modal-delete";
import { deleteOperationAction } from "../operation-action";
import { useAction } from "next-safe-action/hooks";
import { GET_STAT_COUNTER } from "@/query/stat-query";
import { GET_OPERATIONS } from "../operation-query";

export function OperationAction({ row }: OperationActionProps) {
  const queryClient = useQueryClient();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const onRefetch = () => {
    queryClient.refetchQueries({
      queryKey: [GET_OPERATIONS],
    });
    queryClient.refetchQueries({
      queryKey: [GET_STAT_COUNTER],
    });
  };
  const deleteOperation = useAction(deleteOperationAction, {
    onSuccess: () => onRefetch(),
  });

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
        <OperationSave
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
          onDelete={async () => deleteOperation.executeAsync(row.id)}
        />
      )}
    </>
  );
}

type OperationActionProps = {
  row: ArrayElement<GetOperations["results"]>;
};
