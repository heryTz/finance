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
import { GetPaymentsMode } from "../payment-mode-service";
import { PaymentModeSave } from "./payment-mode-save";
import { deletePaymentModeAction } from "../payment-mode-action";
import { useAction } from "next-safe-action/hooks";

export function PaymentModeAction({ row }: PaymentModeActionProps) {
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const deletePaymentMode = useAction(deletePaymentModeAction, {
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
        <PaymentModeSave
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
          onDelete={async () => deletePaymentMode.executeAsync(row.id)}
        />
      )}
    </>
  );
}
type PaymentModeActionProps = {
  row: ArrayElement<GetPaymentsMode["results"]>;
};
