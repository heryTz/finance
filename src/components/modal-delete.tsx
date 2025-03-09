import { Modal } from "@/components/modal";
import { SafeActionResult } from "next-safe-action";
import { useTransition } from "react";
import { toast } from "sonner";
import { ZodString } from "zod";

export function ModalDelete({
  onDelete,
  open,
  onOpenChange,
  label,
}: ModalDeleteProps) {
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(async () => {
      const result = await onDelete();
      if (
        result?.serverError ||
        result?.validationErrors ||
        result?.bindArgsValidationErrors
      ) {
        toast.error("Une erreur est survenue.");
        return;
      }
      toast.success("Suppression effectué avec succès");
      onOpenChange(false);
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
  onDelete: () => Promise<
    | SafeActionResult<
        string,
        ZodString,
        readonly [],
        {
          _errors?: string[] | undefined;
        },
        readonly [],
        unknown
      >
    | undefined
  >;
};
