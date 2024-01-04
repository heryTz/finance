import { Block } from "@/components/block";
import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useInvoiceConfig, useInvoiceConfigSave } from "./config-query";
import { Loader } from "@/components/loader";
import { ErrorSection } from "@/components/error-section";
import { SaveInvoiceConfigInput } from "@/app/api/v1/invoice/config/route";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";

type FormValue = SaveInvoiceConfigInput;

export function ConfigListing() {
  const { back } = useRouter();
  const { data, isLoading, error } = useInvoiceConfig();
  const { mutateAsync, isLoading: saveLoading } = useInvoiceConfigSave();
  const config = data?.data;
  const { register, handleSubmit, formState, reset } = useForm<FormValue>({
    defaultValues: config,
  });
  const { isValid, isDirty } = formState;

  useEffect(() => {
    if (config) reset(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync(data);
    enqueueSnackbar("Configuration enregistrée", { variant: "success" });
  });

  return (
    <Block title="Configuration de mes factures">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {isLoading || !config ? (
          <Loader />
        ) : error ? (
          <ErrorSection />
        ) : (
          <Stack direction={"column"} gap={3}>
            <Stack direction={"column"} gap={2}>
              <Typography>Prestataire</Typography>
              <Grid container spacing={2}>
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
                  <TextField
                    label="Téléphone"
                    fullWidth
                    {...register("phone")}
                  />
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
            </Stack>
            <Stack direction={"row"} spacing={2} justifyContent={"center"}>
              <Button onClick={back}>Annuler</Button>
              <Button
                variant="contained"
                onClick={onSubmit}
                disabled={!isDirty || !isValid || saveLoading}
              >
                Sauvegarder
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </Block>
  );
}
