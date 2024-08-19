import { useFinanceDeleteStore } from "../finance-store";
import { useFinanceDelete } from "../finance-query";
import { enqueueSnackbar } from "notistack";
import { Modal } from "@/components/modal";

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
    <Modal
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title="Confirmation de la suppression"
      description=""
      submit={{
        onClick: onSubmit,
        variant: "destructive",
        children: "Supprimer",
        disabled: isLoading,
      }}
      cancel={{ onClick: onClose, children: "Annuler" }}
    >
      <p className="text-muted-foreground">
        Etes-vous sûr de vouloir supprimer l&apos;opération{" "}
        <strong>{itemToDelete.label}</strong> ?
      </p>
    </Modal>
  );
}
