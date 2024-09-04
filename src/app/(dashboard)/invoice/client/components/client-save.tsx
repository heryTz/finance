import { useForm } from "react-hook-form";
import {
  useCreateInvoiceClient,
  useGetByIdInvoiceClient,
  usePutInvoiceClient,
} from "../client-query";
import { useEffect } from "react";
import { Loader } from "@/components/loader";
import { saveClientInputSchema } from "../client-dto";
import { toast } from "sonner";
import { zd } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/modal";
import { Form, FormField } from "@/components/ui/form";
import { InputField } from "@/components/input-field";

type FormValue = zd.infer<typeof saveClientInputSchema>;

export function ClientSave({
  open,
  onOpenChange,
  idToEdit,
  onFinish,
}: ClientSaveProps) {
  const clientFn = useGetByIdInvoiceClient(idToEdit);
  const client = clientFn.data?.data;
  const createFn = useCreateInvoiceClient();
  const updateFn = usePutInvoiceClient(idToEdit);

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

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (idToEdit) {
        await updateFn.mutateAsync(data);
        toast.success("Modification effectuée avec succès");
      } else {
        await createFn.mutateAsync(data);
        toast.success("Ajout effectué avec succès");
      }
      onOpenChange(false);
      onFinish?.();
      reset();
    } catch (error) {
      toast.error("Une erreur s'est produite");
    }
  });

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
        disabled:
          createFn.isLoading || clientFn.isLoading || updateFn.isLoading,
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
  onFinish?: () => void;
  idToEdit?: string;
};
