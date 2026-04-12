"use client";

import { ArrayElement } from "@/lib/types";
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
import { useRouter } from "next/navigation";
import { GetInvoices } from "../invoice-service";
import { ModalDelete } from "@/components/modal-delete";
import { deleteInvoiceAction } from "../invoice-action";
import { routes } from "@/app/routes";
import { useAction } from "next-safe-action/hooks";

export function InvoiceAction({ row }: InvoiceActionProps) {
  const { push, refresh } = useRouter();
  const [openDelete, setOpenDelete] = useState(false);
  const deleteInvoice = useAction(deleteInvoiceAction, {
    onSuccess: () => refresh(),
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
          <DropdownMenuItem onClick={() => push(routes.invoiceShow(row.id))}>
            Télécharger
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => push(routes.invoiceEdit(row.id))}>
            Editer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {openDelete && (
        <ModalDelete
          open={openDelete}
          onOpenChange={setOpenDelete}
          label={`No ${row.ref}`}
          onDelete={async () => deleteInvoice.executeAsync(row.id)}
        />
      )}
    </>
  );
}

type InvoiceActionProps = {
  row: ArrayElement<GetInvoices["results"]>;
};
