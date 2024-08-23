import { zodResolver } from "@hookform/resolvers/zod";
import {
  SendInvoiceMailInput,
  sendInvoiceMailInputSchema,
} from "../../../invoice-dto";
import { useForm } from "react-hook-form";
import { useEffect, useTransition } from "react";
import { useGetProvider } from "../../../../provider/provider-query";
import { Loader } from "@/components/loader";
import { useGetInvoiceById } from "../../../invoice-query";
import {
  defaultInvoiceContent,
  defaultInvoiceSubject,
} from "../../../invoice-util";
import { invoiceDetaultFilename } from "../../../components/invoice-list";
import { toast } from "sonner";
import { Modal } from "@/components/modal";
import { Form, FormField } from "@/components/ui/form";
import { InputField } from "@/components/input-field";
import { TextareaField } from "@/components/textarea-field";

export function InvoiceMailing({
  open,
  onOpenChange,
  id,
  onSubmit,
}: InvoiceMailingProps) {
  const [isPending, startTransition] = useTransition();
  const providerFn = useGetProvider();
  const invoiceFn = useGetInvoiceById(id);

  const form = useForm<SendInvoiceMailInput>({
    defaultValues: {
      content: "",
      subject: "",
      file: "",
    },
    resolver: zodResolver(sendInvoiceMailInputSchema),
  });

  useEffect(() => {
    if (providerFn?.data && invoiceFn?.data) {
      form.reset({
        subject: defaultInvoiceSubject(),
        content: defaultInvoiceContent({
          senderName: providerFn.data.data?.name ?? "",
        }),
        file: "placeholder",
        filename: invoiceDetaultFilename(invoiceFn.data),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerFn?.data, invoiceFn?.data]);

  const submit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        await onSubmit(data);
        toast.success("Votre facture a été envoyé");
        onOpenChange(false);
      } catch (error) {
        toast.error("Une erreur est survenue lors de l'envoi de votre facture");
      }
    });
  });

  const isLoading = providerFn.isLoading || invoiceFn.isLoading;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Envoyer la facture n° ${invoiceFn?.data?.ref ?? "..."} par mail`}
      submit={{
        children: "Envoyer",
        onClick: submit,
        disabled: isPending || isLoading,
      }}
      cancel={{ onClick: () => onOpenChange(false) }}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <Form {...form}>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => <InputField label="Sujet *" {...field} />}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <TextareaField label="Contenu *" {...field} rows={10} />
              )}
            />
            <FormField
              control={form.control}
              name="filename"
              render={({ field }) => (
                <InputField label="Nom du fichier *" {...field} />
              )}
            />
          </div>
        </Form>
      )}
    </Modal>
  );
}

export type InvoiceMailingProps = {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  id: string;
  onSubmit: (
    data: Pick<SendInvoiceMailInput, "content" | "subject">,
  ) => Promise<void>;
};
