import { ConfirmationModal } from "@/components/modal";
import { Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useInvoiceDeleteStore } from "./invoice-store";
import { useTransition } from "react";
import { deleteInvoice } from "./invoice-action";

export function InvoiceDelete() {
  const { open, onClose, itemToDelete, onFinish } = useInvoiceDeleteStore();
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(async () => {
      await deleteInvoice(itemToDelete!.id);
      enqueueSnackbar("Suppression effectué avec succès", {
        variant: "success",
      });
      onFinish();
    });
  };

  if (!open || !itemToDelete) return null;

  return (
    <ConfirmationModal
      submitLabel="Supprimer"
      title="Confirmation"
      content={
        <Typography>
          Voulez-vous supprimer la facture <strong>{itemToDelete.label}</strong>{" "}
          ?
        </Typography>
      }
      onSubmit={onSubmit}
      onCancel={onClose}
      loading={isPending}
      open={open}
    />
  );
}
