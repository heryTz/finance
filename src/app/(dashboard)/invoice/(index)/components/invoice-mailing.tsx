import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import {
  SendInvoiceMailInput,
  sendInvoiceMailInputSchema,
} from "../invoice-dto";
import { useForm } from "react-hook-form";
import { useEffect, useTransition } from "react";
import { enqueueSnackbar } from "notistack";
import { sendInvoiceMailAction } from "../invoice-action";
import { useGetProvider } from "../../provider/provider-query";
import { Loader } from "@/components/loader";
import { useGetInvoiceById } from "../invoice-query";
import { defaultInvoiceContent, defaultInvoiceSubject } from "../invoice-util";

export function InvoiceMailing({
  open,
  onClose,
  onFinish,
  id,
}: InvoiceMailingProps) {
  const [isPending, startTransition] = useTransition();
  const provider = useGetProvider();
  const invoice = useGetInvoiceById(id);

  const { register, formState, handleSubmit, reset } =
    useForm<SendInvoiceMailInput>({
      defaultValues: {
        content: "fdfsd",
        subject: "fsdfsdfdfsdfsd",
      },
      resolver: zodResolver(sendInvoiceMailInputSchema),
    });
  const { isValid, isDirty } = formState;

  useEffect(() => {
    if (provider?.data && !isDirty) {
      reset({
        subject: defaultInvoiceSubject(),
        content: defaultInvoiceContent({
          senderName: provider.data.data?.name ?? "",
        }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider?.data]);

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      try {
        await sendInvoiceMailAction(id, data);
        enqueueSnackbar("Votre facture a été envoyé", { variant: "success" });
        onFinish?.();
      } catch (error: any) {
        enqueueSnackbar({ message: error?.message, variant: "error" });
      }
    });
  });

  const isLoading = provider.isLoading || invoice.isLoading;

  return (
    <Dialog open={open} keepMounted maxWidth="sm" fullWidth>
      <DialogTitle>{`Envoyer la facture n° ${invoice?.data?.ref} par mail`}</DialogTitle>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DialogContent>
            <Stack direction={"column"} gap={2} sx={{ mt: 1 }}>
              <TextField label="Sujet *" fullWidth {...register("subject")} />
              <TextField
                multiline
                rows={10}
                label="Contenu *"
                fullWidth
                {...register("content")}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Annuler</Button>
            <Button
              variant="contained"
              disabled={!isValid || isPending || isLoading}
              onSubmit={onSubmit}
            >
              Envoyer
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export type InvoiceMailingProps = {
  open: boolean;
  onClose: () => void;
  id: string;
  onFinish?: () => void;
};
