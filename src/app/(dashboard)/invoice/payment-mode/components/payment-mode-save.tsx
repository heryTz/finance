import { useForm } from "react-hook-form";
import { useEffect, useTransition } from "react";
import { Loader } from "@/components/loader";
import { useGetPaymentsMode } from "../payment-mode-query";
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

type FormValue = CreatePaymentModeInput;

export function PaymentModeSave({
  open,
  onOpenChange,
  idToEdit,
  onFinish,
}: PaymentModeSaveProps) {
  const [isPending, startTransition] = useTransition();
  const paymentModeFn = useGetPaymentsMode(idToEdit);
  const paymentMode = paymentModeFn.data;
  const form = useForm<FormValue>({
    resolver: zodResolver(createPaymentModeSchema),
  });

  useEffect(() => {
    if (paymentMode) {
      form.reset(createPaymentModeSchema.parse(paymentMode));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMode]);

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        if (idToEdit) {
          await updatePaymentModeAction(idToEdit, data);
          toast.success("Modification effectué avec succès");
        } else {
          await createPaymentModeAction(data);
          toast.success("Ajout effectué avec succès");
        }
        onOpenChange(false);
        onFinish?.();
      } catch (error) {
        toast.error("Erreur s'est produite");
      }
    });
  });

  const onCancel = () => {
    onOpenChange(false);
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
        disabled: isPending || paymentModeFn.isLoading,
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
  onFinish?: () => void;
};
