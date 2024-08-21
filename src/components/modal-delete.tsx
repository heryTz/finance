import { Modal } from "@/components/modal";
import { useTransition } from "react";
import { toast } from "sonner";

export function ModalDelete({
  onDelete,
  open,
  onOpenChange,
  label,
}: ModalDeleteProps) {
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(async () => {
      try {
        await onDelete();
        toast("Suppression effectué avec succès");
        onOpenChange(false);
      } catch (error) {
        toast.error("Une erreur est survenue");
      }
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Confirmation de la suppression"
      description=""
      submit={{
        onClick: onSubmit,
        variant: "destructive",
        children: "Supprimer",
        disabled: isPending,
      }}
      cancel={{ onClick: () => onOpenChange(false), children: "Annuler" }}
    >
      <p className="text-muted-foreground">
        Etes-vous sûr de vouloir supprimer l&apos;opération{" "}
        <strong>{label}</strong> ?
      </p>
    </Modal>
  );
}

type ModalDeleteProps = {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  label: string;
  onDelete: () => Promise<void>;
};
