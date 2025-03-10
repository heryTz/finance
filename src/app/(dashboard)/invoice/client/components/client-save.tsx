import { useForm } from "react-hook-form";
import { useGetClientById } from "../client-query";
import { useEffect } from "react";
import { Loader } from "@/components/loader";
import { saveClientInputSchema } from "../client-dto";
import { toast } from "sonner";
import { zd } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/modal";
import { Form, FormField } from "@/components/ui/form";
import { InputField } from "@/components/input-field";
import { Client } from "@prisma/client";
import { createClientAction, updateClientAction } from "../client-action";
import { useAction } from "next-safe-action/hooks";

type FormValue = zd.infer<typeof saveClientInputSchema>;

export function ClientSave({
  open,
  onOpenChange,
  idToEdit,
  onFinish,
}: ClientSaveProps) {
  const clientFn = useGetClientById(idToEdit);
  const client = clientFn.data?.data;
  const create = useAction(createClientAction, {
    onSuccess: (resp) => {
      if (!resp.data) return;
      toast.success("Ajout effectué avec succès");
      onOpenChange(false);
      onFinish?.(resp.data);
      reset();
    },
    onError: () => toast.error("Une erreur s'est produite"),
  });
  const update = useAction(updateClientAction.bind(null, idToEdit!), {
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
    resolver: zodResolver(saveClientInputSchema),
  });

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const reset = () => {
    form.reset(client ? saveClientInputSchema.parse(client) : {});
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
          ? `Modifier le client "${client?.name ?? "..."}"`
          : "Ajouter un client"
      }
      cancel={{ onClick: onCancel }}
      submit={{
        children: "Sauvegarder",
        onClick: onSubmit,
        disabled: create.isPending || update.isPending || clientFn.isLoading,
      }}
    >
      {idToEdit && clientFn.isLoading ? (
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

type ClientSaveProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinish?: (client: Client) => void;
  idToEdit?: string;
};
