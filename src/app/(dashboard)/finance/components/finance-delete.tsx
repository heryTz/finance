import { ConfirmationModal } from "@/components/modal";
import { useFinanceDeleteStore } from "../finance-store";
import { Typography } from "@mui/material";
import { useFinanceDelete } from "../finance-query";
import { enqueueSnackbar } from "notistack";

export function FinanceDelete() {
  const { open, onClose, itemToDelete, onFinish } = useFinanceDeleteStore();
  const { mutate, isLoading } = useFinanceDelete();

  const onSubmit = () => {
    mutate(itemToDelete?.id!, {
      onSuccess: () => {
        enqueueSnackbar("Suppression effectué avec succès", {
          variant: "success",
        });
        onFinish();
      },
    });
  };

  if (!open || !itemToDelete) return null;

  return (
    <ConfirmationModal
      submitLabel="Supprimer"
      title="Confirmation"
      content={
        <Typography>
          Voulez-vous supprimer le <strong>{itemToDelete.label}</strong> ?
        </Typography>
      }
      onSubmit={onSubmit}
      onCancel={onClose}
      loading={isLoading}
      open={open}
    />
  );
}
