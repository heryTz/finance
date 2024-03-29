import { ConfirmationModal } from "@/components/modal";
import { Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { usePaymentsModeDeleteStore } from "../payment-mode-store";
import { useTransition } from "react";
import { deletePaymentModeAction } from "../payment-mode-action";

export function PaymentsModeDelete() {
  const [isPending, startTransition] = useTransition();
  const { open, onClose, itemToDelete, onFinish } =
    usePaymentsModeDeleteStore();

  const onSubmit = () => {
    startTransition(async () => {
      await deletePaymentModeAction(itemToDelete!.id);
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
          Voulez-vous supprimer la mode de paiement{" "}
          <strong>{itemToDelete.label}</strong> ?
        </Typography>
      }
      onSubmit={onSubmit}
      onCancel={onClose}
      loading={isPending}
      open={open}
    />
  );
}
