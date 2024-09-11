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
import { GetProviders } from "../provider-service";
import { ProviderSave } from "./provider-save";
import { deleteProviderAction } from "../provider-action";

export function ProviderAction({ row }: ProviderActionProps) {
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const onRefetch = () => {
    router.refresh();
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
      <ProviderSave
        open={openEdit}
        onOpenChange={setOpenEdit}
        onFinish={onRefetch}
        idToEdit={row.id}
      />
      <ModalDelete
        open={openDelete}
        onOpenChange={setOpenDelete}
        label={row.name}
        onDelete={async () => {
          await deleteProviderAction(row.id);
          onRefetch();
        }}
      />
    </>
  );
}
type ProviderActionProps = {
  row: ArrayElement<GetProviders["results"]>;
};
