import { ConfirmationModal } from "@/components/modal";
import { Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useClientDeleteStore } from "./client-store";
import { useDeleteInvoiceClient } from "./client-query";

export function ClientDelete() {
  const { open, onClose, itemToDelete, onFinish } = useClientDeleteStore();
  const { mutateAsync, isLoading } = useDeleteInvoiceClient(
    itemToDelete?.id ?? null
  );

  const onSubmit = async () => {
    await mutateAsync();
    enqueueSnackbar("Suppression effectué avec succès", {
      variant: "success",
    });
    onFinish();
  };

  if (!open || !itemToDelete) return null;

  return (
    <ConfirmationModal
      submitLabel="Supprimer"
      title="Confirmation"
      content={
        <Typography>
          Voulez-vous supprimer le client <strong>{itemToDelete.label}</strong>{" "}
          ?
        </Typography>
      }
      onSubmit={onSubmit}
      onCancel={onClose}
      loading={isLoading}
      open={open}
    />
  );
}
