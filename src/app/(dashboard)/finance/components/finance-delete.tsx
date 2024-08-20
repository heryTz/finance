import { useFinanceDelete } from "../finance-query";
import { Modal } from "@/components/modal";
import { toast } from "sonner";

export function FinanceDelete({
  open,
  onOpenChange,
  onFinish,
  item,
}: FinanceDeleteProps) {
  const { mutateAsync, isLoading } = useFinanceDelete();

  const onSubmit = async () => {
    try {
      await mutateAsync(item.id);
      toast("Suppression effectué avec succès");
      onOpenChange(false);
      onFinish?.();
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
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
        disabled: isLoading,
      }}
      cancel={{ onClick: () => onOpenChange(false), children: "Annuler" }}
    >
      <p className="text-muted-foreground">
        Etes-vous sûr de vouloir supprimer l&apos;opération{" "}
        <strong>{item.label}</strong> ?
      </p>
    </Modal>
  );
}

type FinanceDeleteProps = {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  onFinish?: () => void;
  item: {
    id: string;
    label: string;
  };
};
