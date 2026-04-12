import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Loader } from "@/components/loader";
import { useGetPaymentModeById } from "../payment-mode-query";
import {
  CreatePaymentModeInput,
  createPaymentModeSchema,
} from "../payment-mode-dto";
import {
  createPaymentModeAction,
  updatePaymentModeAction,
} from "../payment-mode-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "@/components/modal";
import { Form, FormField } from "@/components/ui/form";
import { InputField } from "@/components/input-field";
import { PaymentMode } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";

type FormValue = CreatePaymentModeInput;

export function PaymentModeSave({
  open,
  onOpenChange,
  idToEdit,
  onFinish,
}: PaymentModeSaveProps) {
  const paymentModeFn = useGetPaymentModeById(idToEdit);
  const paymentMode = paymentModeFn.data;
  const form = useForm<FormValue>({
    resolver: zodResolver(createPaymentModeSchema),
  });
  const create = useAction(createPaymentModeAction, {
    onSuccess: (resp) => {
      if (!resp.data) return;
      toast.success("Ajout effectué avec succès");
      onOpenChange(false);
      onFinish?.(resp.data);
      reset();
    },
    onError: () => toast.error("Erreur s'est produite"),
  });
  const update = useAction(updatePaymentModeAction.bind(null, idToEdit!), {
    onSuccess: (resp) => {
      if (!resp.data) return;
      toast.success("Modification effectué avec succès");
      onOpenChange(false);
      onFinish?.(resp.data);
      reset();
    },
    onError: () => toast.error("Erreur s'est produite"),
  });

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMode]);

  const reset = () => {
    if (paymentMode) {
      form.reset(createPaymentModeSchema.parse(paymentMode));
    } else {
      form.reset();
    }
  };

  const onSubmit = form.handleSubmit((data) =>
    idToEdit ? update.execute(data) : create.execute(data),
  );

  const onCancel = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Modal
      open={open}
      onOpenChange={(v) => !v && onCancel()}
      title={
        idToEdit
          ? `Modifier la mode paiement "${paymentMode?.name ?? "..."}"`
          : "Ajouter une mode de paiement"
      }
      cancel={{ onClick: onCancel }}
      submit={{
        children: "Sauvegarder",
        onClick: onSubmit,
        disabled:
          create.isPending || update.isPending || paymentModeFn.isLoading,
      }}
    >
      {idToEdit && paymentModeFn.isLoading ? (
        <Loader />
      ) : (
        <Form {...form}>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => <InputField label="Nom *" {...field} />}
            />
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <InputField label="Titulaire du compte" {...field} />
              )}
            />
            <FormField
              control={form.control}
              name="iban"
              render={({ field }) => <InputField label="IBAN" {...field} />}
            />
            <FormField
              control={form.control}
              name="bic"
              render={({ field }) => <InputField label="BIC" {...field} />}
            />
          </div>
        </Form>
      )}
    </Modal>
  );
}

type PaymentModeSaveProps = {
  idToEdit?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinish?: (newPaymentMode: PaymentMode) => void;
};
