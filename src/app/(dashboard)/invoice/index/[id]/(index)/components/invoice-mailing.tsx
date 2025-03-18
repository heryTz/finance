import { zodResolver } from "@hookform/resolvers/zod";
import {
  SendInvoiceMailInput,
  sendInvoiceMailInputSchema,
} from "../../../invoice-dto";
import { useForm } from "react-hook-form";
import { useEffect, useTransition } from "react";
import { Loader } from "@/components/loader";
import { useGetInvoiceById } from "../../../invoice-query";
import {
  defaultInvoiceContent,
  defaultInvoiceSubject,
} from "../../../invoice-util";
import { invoiceDetaultFilename } from "../../../invoice-page";
import { toast } from "sonner";
import { Modal } from "@/components/modal";
import { Form, FormField } from "@/components/ui/form";
import { InputField } from "@/components/input-field";
import { TextareaField } from "@/components/textarea-field";
import { useAction } from "next-safe-action/hooks";
import { sendInvoiceMailAction } from "../../../invoice-action";

export function InvoiceMailing({
  open,
  onOpenChange,
  id,
  buildInput,
}: InvoiceMailingProps) {
  const [isPending, startTransition] = useTransition();
  const invoiceFn = useGetInvoiceById(id);
  const sendInvoiceMail = useAction(sendInvoiceMailAction.bind(null, id));

  const form = useForm<SendInvoiceMailInput>({
    defaultValues: {
      content: "",
      subject: "",
      file: "",
    },
    resolver: zodResolver(sendInvoiceMailInputSchema),
  });

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceFn?.data]);

  const reset = () => {
    if (invoiceFn?.data) {
      form.reset({
        subject: defaultInvoiceSubject(),
        content: defaultInvoiceContent({
          senderName: invoiceFn.data.Provider.name ?? "",
        }),
        file: "placeholder",
        filename: invoiceDetaultFilename(invoiceFn.data),
      });
    } else {
      form.reset();
    }
  };

  const submit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        const input = await buildInput(data);
        const result = await sendInvoiceMail.executeAsync(input);
        if (
          result?.serverError ||
          result?.validationErrors ||
          result?.bindArgsValidationErrors
        ) {
          toast.error("Une erreur est survenue.");
          return;
        }
        toast.success("Votre facture a été envoyé");
        onOpenChange(false);
        reset();
      } catch (error) {
        console.log(error);
        toast.error("Une erreur est survenue.");
      }
    });
  });

  const cancel = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Modal
      open={open}
      onOpenChange={(v) => !v && cancel()}
      title={`Envoyer la facture n° ${invoiceFn?.data?.ref ?? "..."} par mail`}
      submit={{
        children: "Envoyer",
        onClick: submit,
        disabled: isPending || invoiceFn.isLoading,
      }}
      cancel={{ onClick: cancel }}
    >
      {invoiceFn.isLoading ? (
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
  buildInput: (
    data: Pick<SendInvoiceMailInput, "content" | "subject">,
  ) => Promise<SendInvoiceMailInput>;
};
