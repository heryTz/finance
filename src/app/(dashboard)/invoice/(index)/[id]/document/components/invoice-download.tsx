import { InputField } from "@/components/input-field";
import { Modal } from "@/components/modal";
import { Form, FormField } from "@/components/ui/form";
import { zd } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const schema = zd.object({
  filename: zd.string().min(1),
});

export function InvoiceDownload({
  open,
  onDownload,
  onOpenChange,
  defaultFilename,
}: InvoiceDownloadProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<zd.infer<typeof schema>>({
    defaultValues: { filename: defaultFilename },
    resolver: zodResolver(schema),
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        await onDownload(data.filename);
        onOpenChange(false);
      } catch (error) {
        toast.error(
          "Une erreur est survenue lors du téléchargement de votre facture.",
        );
      }
    });
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Téléchargement de votre facture"
      submit={{
        children: "Télécharger",
        disabled: isPending,
        onClick: onSubmit,
      }}
      cancel={{ onClick: () => onOpenChange(false) }}
    >
      <Form {...form}>
        <FormField
          control={form.control}
          name="filename"
          render={({ field }) => (
            <InputField label="Nom du fichier" {...field} />
          )}
        />
      </Form>
    </Modal>
  );
}

type InvoiceDownloadProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (filename: string) => Promise<void>;
  defaultFilename?: string;
};
