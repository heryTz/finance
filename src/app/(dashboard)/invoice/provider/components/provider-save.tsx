import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Loader } from "@/components/loader";
import { toast } from "sonner";
import { zd } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/modal";
import { Form, FormField } from "@/components/ui/form";
import { InputField } from "@/components/input-field";
import { saveProviderInputSchema } from "../provider-dto";
import { useGetProviderById } from "../provider-query";
import { Provider } from "@prisma/client";
import { createProviderAction, updateProviderAction } from "../provider-action";
import { useAction } from "next-safe-action/hooks";

type FormValue = zd.infer<typeof saveProviderInputSchema>;

export function ProviderSave({
  open,
  onOpenChange,
  idToEdit,
  onFinish,
}: ProviderSaveProps) {
  const providerFn = useGetProviderById(idToEdit);
  const provider = providerFn.data;
  const create = useAction(createProviderAction, {
    onSuccess: (resp) => {
      if (!resp.data) return;
      toast.success("Ajout effectué avec succès");
      onOpenChange(false);
      onFinish?.(resp.data);
      reset();
    },
    onError: () => toast.error("Une erreur s'est produite"),
  });
  const update = useAction(updateProviderAction.bind(null, idToEdit!), {
    onSuccess: (resp) => {
      if (!resp.data) return;
      toast.success("Modification effectuée avec succès");
      onOpenChange(false);
      onFinish?.(resp.data);
      reset();
    },
    onError: () => toast.error("Une erreur s'est produite"),
  });

  const form = useForm<FormValue>({
    resolver: zodResolver(saveProviderInputSchema),
  });

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const reset = () => {
    form.reset(provider ? saveProviderInputSchema.parse(provider) : {});
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
          ? `Modifier le prestataire "${provider?.name ?? "..."}"`
          : "Ajouter un prestataire"
      }
      cancel={{ onClick: onCancel }}
      submit={{
        children: "Sauvegarder",
        onClick: onSubmit,
        disabled: create.isPending || update.isPending || providerFn.isLoading,
      }}
    >
      {idToEdit && providerFn.isLoading ? (
        <Loader />
      ) : (
        <Form {...form}>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => <InputField label="Nom *" {...field} />}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <InputField label="Adresse *" {...field} />
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <InputField label="Email *" {...field} type="email" />
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <InputField label="Téléphone *" {...field} />
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nif"
                render={({ field }) => <InputField label="NIF" {...field} />}
              />
              <FormField
                control={form.control}
                name="siren"
                render={({ field }) => <InputField label="Siren" {...field} />}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ape"
                render={({ field }) => <InputField label="APE" {...field} />}
              />
            </div>
          </div>
        </Form>
      )}
    </Modal>
  );
}

type ProviderSaveProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinish?: (provider: Provider) => void;
  idToEdit?: string;
};
