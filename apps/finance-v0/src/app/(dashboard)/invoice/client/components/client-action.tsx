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
import { ModalDelete } from "@/components/modal-delete";
import { useRouter } from "next/navigation";
import { ArrayElement } from "@/lib/types";
import { GetClients } from "../client-service";
import { ClientSave } from "./client-save";
import { deleteClientAction } from "../client-action";
import { useAction } from "next-safe-action/hooks";

export function ClientAction({ row }: ClientActionProps) {
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const deleteClient = useAction(deleteClientAction, {
    onSuccess: () => router.refresh(),
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
        <ClientSave
          idToEdit={row.id}
          open={openEdit}
          onOpenChange={setOpenEdit}
          onFinish={() => router.refresh()}
        />
      )}
      {openDelete && (
        <ModalDelete
          open={openDelete}
          onOpenChange={setOpenDelete}
          label={row.name}
          onDelete={async () => deleteClient.executeAsync(row.id)}
        />
      )}
    </>
  );
}
type ClientActionProps = {
  row: ArrayElement<GetClients["results"]>;
};
