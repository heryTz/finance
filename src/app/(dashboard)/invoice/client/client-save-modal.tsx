import { useForm } from "react-hook-form";
import {
  useCreateInvoiceClient,
  useGetByIdInvoiceClient,
  usePutInvoiceClient,
} from "./client-query";
import { useClientSaveStore } from "./client-store";
import { useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { Loader } from "@/components/loader";

type FormValue = {
  name: string;
  email: string;
  phone: string | null;
  address: string;
  siren: string | null;
  ape: string | null;
  nif: string | null;
};

export function ClientSaveModal() {
  const { open, onClose, onFinish, idToEdit } = useClientSaveStore();
  const { data: clientData, isLoading: clientLoading } =
    useGetByIdInvoiceClient(idToEdit);
  const client = clientData?.data;
  const { mutateAsync: create, isLoading: saveLoading } =
    useCreateInvoiceClient();
  const { mutateAsync: update, isLoading: updateLoading } =
    usePutInvoiceClient(idToEdit);

  const { register, formState, handleSubmit, reset } = useForm<FormValue>();
  const { isValid } = formState;

  useEffect(() => {
    if (client) {
      reset(client);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const onSubmit = handleSubmit(async (data) => {
    if (idToEdit) {
      await update(data);
      enqueueSnackbar("Modification effectué avec succès", {
        variant: "success",
      });
    } else {
      await create(data);
      enqueueSnackbar("Ajout effectué avec succès", { variant: "success" });
    }
    onFinish();
  });

  const onCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} keepMounted maxWidth="sm" fullWidth>
      <DialogTitle>
        {idToEdit && client
          ? `Modifier le client ${client.name}`
          : "Ajouter un client"}
      </DialogTitle>
      {idToEdit && clientLoading ? (
        <Loader />
      ) : (
        <>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item lg={6} style={{ width: "100%" }}>
                <TextField
                  label="Nom *"
                  fullWidth
                  {...register("name", { required: true })}
                />
              </Grid>
              <Grid item lg={6} style={{ width: "100%" }}>
                <TextField
                  label="Adresse *"
                  fullWidth
                  {...register("address", { required: true })}
                />
              </Grid>
              <Grid item lg={6} style={{ width: "100%" }}>
                <TextField
                  label="Email *"
                  fullWidth
                  {...register("email", { required: true })}
                />
              </Grid>
              <Grid item lg={6} style={{ width: "100%" }}>
                <TextField label="Téléphone" fullWidth {...register("phone")} />
              </Grid>
              <Grid item lg={6} style={{ width: "100%" }}>
                <TextField label="NIF" fullWidth {...register("nif")} />
              </Grid>
              <Grid item lg={6} style={{ width: "100%" }}>
                <TextField label="Siren" fullWidth {...register("siren")} />
              </Grid>
              <Grid item lg={6} style={{ width: "100%" }}>
                <TextField label="APE" fullWidth {...register("ape")} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancel}>Annuler</Button>
            <Button
              variant="contained"
              disabled={
                !isValid || saveLoading || clientLoading || updateLoading
              }
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
