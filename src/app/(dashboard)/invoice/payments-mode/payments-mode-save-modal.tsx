import { useForm } from "react-hook-form";
import { useEffect, useTransition } from "react";
import { enqueueSnackbar } from "notistack";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { Loader } from "@/components/loader";
import { usePaymentsModeSaveStore } from "./payments-mode-store";
import { useGetPaymentsMode } from "./payments-mode-query";
import {
  CreatePaymentModeInput,
  createPaymentModeSchema,
} from "./payments-mode-action-dto";
import { createPaymentMode, updatePaymentMode } from "./payments-mode-action";
import { zodResolver } from "@hookform/resolvers/zod";

type FormValue = CreatePaymentModeInput;

export function PaymentsModeSaveModal() {
  const [isPending, startTransition] = useTransition();
  const { open, onClose, onFinish, idToEdit } = usePaymentsModeSaveStore();
  const { data: paymentMode, isLoading: clientLoading } =
    useGetPaymentsMode(idToEdit);

  const { register, formState, handleSubmit, reset } = useForm<FormValue>({
    defaultValues: { name: "" },
    resolver: zodResolver(createPaymentModeSchema),
  });
  const { isValid } = formState;

  useEffect(() => {
    if (paymentMode) {
      reset({
        accountName: paymentMode.accountName ?? "",
        iban: paymentMode.iban ?? "",
        name: paymentMode.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMode]);

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      try {
        if (idToEdit) {
          await updatePaymentMode(idToEdit, data);
          enqueueSnackbar("Modification effectué avec succès", {
            variant: "success",
          });
        } else {
          await createPaymentMode(data);
          enqueueSnackbar("Ajout effectué avec succès", { variant: "success" });
        }
        onFinish();
      } catch (error: any) {
        enqueueSnackbar({ message: error?.message, variant: "error" });
      }
    });
  });

  const onCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} keepMounted maxWidth="sm" fullWidth>
      <DialogTitle>
        {idToEdit && paymentMode
          ? `Modifier la mode paiement ${paymentMode.name}`
          : "Ajouter une mode de paiement"}
      </DialogTitle>
      {idToEdit && clientLoading ? (
        <Loader />
      ) : (
        <>
          <DialogContent>
            <Stack direction={"column"} gap={2} sx={{ mt: 1 }}>
              <TextField label="Nom *" fullWidth {...register("name")} />
              <TextField
                label="Titulaire du compte"
                fullWidth
                {...register("accountName")}
              />
              <TextField label="IBAN" fullWidth {...register("iban")} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancel}>Annuler</Button>
            <Button
              variant="contained"
              disabled={!isValid || clientLoading || isPending}
              onClick={onSubmit}
            >
              Sauvegarder
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
