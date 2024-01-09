"use client";
import { Block } from "@/components/block";
import { GetClients } from "../client/client-service";
import { GetInvoiceById, GetProducts } from "../invoice-service";
import {
  Autocomplete,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { createInvoice, updateInvoice } from "../invoice-action";
import { CURRENCY, Currency } from "../invoice-util";
import { Add, Delete } from "@mui/icons-material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CreateInvoiceInput, createInvoiceSchema } from "../invoice-action-dto";
import { useTransition } from "react";
import { enqueueSnackbar } from "notistack";
import { GetPaymentsMode } from "../payments-mode/payments-service";

export function InvoiceSaveForm({
  clients,
  products,
  paymentsMode,
  invoice,
}: InvoiceSaveFormProps) {
  const [isPending, startTransition] = useTransition();
  const { back } = useRouter();
  const { register, formState, control, handleSubmit } =
    useForm<CreateInvoiceInput>({
      defaultValues: {
        tva: invoice?.tva ?? 0,
        products: invoice?.Products ?? [],
        clientId: invoice?.clientId,
        currency: invoice?.currency as Currency,
        paymentModeId: invoice?.paymentModeId,
      },
      resolver: zodResolver(createInvoiceSchema),
    });
  const productsField = useFieldArray({ control, name: "products" });

  const { isDirty, isValid } = formState;

  const clientOptions = clients.results.map((el) => ({
    id: el.id,
    label: el.name,
  }));

  const onSubmit = handleSubmit(async (data) => {
    startTransition(async () => {
      try {
        if (invoice) await updateInvoice(invoice.id, data);
        else await createInvoice(data);
      } catch (error: any) {
        enqueueSnackbar({
          message: error?.message ?? "Une erreur est survenue.",
          variant: "error",
        });
      }
    });
  });

  return (
    <Block
      title={
        invoice
          ? `Modification de la facture No ${invoice.ref}`
          : "Créer une facture"
      }
    >
      <Stack direction={"column"} gap={3} sx={{ mt: 2 }}>
        <Stack direction={"column"} gap={2}>
          <Controller
            control={control}
            name="clientId"
            render={({ field }) => (
              <Autocomplete
                value={clientOptions.find((el) => el.id === field.value)}
                onChange={(_, v) => field.onChange(v?.id)}
                renderInput={(params) => (
                  <TextField {...params} label="Client *" />
                )}
                options={clientOptions}
                isOptionEqualToValue={(o, v) => o.id === v.id}
              />
            )}
          />
          <TextField
            type="number"
            label="TVA (%)"
            {...register("tva", { valueAsNumber: true })}
          />
          <Controller
            control={control}
            name={`currency`}
            render={({ field }) => (
              <TextField
                select
                fullWidth
                label="Devise *"
                value={field.value}
                onChange={field.onChange}
              >
                {CURRENCY.map((el) => (
                  <MenuItem key={el} value={el}>
                    {el}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            control={control}
            name="paymentModeId"
            render={({ field }) => (
              <Autocomplete
                value={paymentsMode.find((el) => el.id === field.value)}
                onChange={(_, v) => field.onChange(v?.id)}
                renderInput={(params) => (
                  <TextField {...params} label="Mode de paiement *" />
                )}
                options={paymentsMode}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                getOptionLabel={(o) => o.name}
              />
            )}
          />
          <Typography>Produits</Typography>
          <Stack direction={"column"} gap={2}>
            {productsField.fields.map((field, index) => (
              <Stack
                key={field.id}
                direction={"row"}
                gap={2}
                flexWrap={"wrap"}
                alignItems={"center"}
              >
                <IconButton
                  color="error"
                  onClick={() => productsField.remove(index)}
                >
                  <Delete />
                </IconButton>
                <Controller
                  control={control}
                  name={`products.${index}.name`}
                  render={({ field: fieldName }) => (
                    <Autocomplete
                      freeSolo
                      value={fieldName.value}
                      onInputChange={(_, v) => fieldName.onChange(v ?? "")}
                      onChange={(_, v) => fieldName.onChange(v ?? "")}
                      renderInput={(params) => (
                        <TextField {...params} label="Nom *" />
                      )}
                      options={products.results.map((el) => el.name)}
                      style={{ flexGrow: 1 }}
                    />
                  )}
                />
                <TextField
                  type="number"
                  label="Prix unitaire *"
                  style={{ width: 200 }}
                  {...register(`products.${index}.price`, {
                    valueAsNumber: true,
                  })}
                />
                <TextField
                  type="number"
                  label="Quantité *"
                  style={{ width: 100 }}
                  {...register(`products.${index}.qte`, {
                    valueAsNumber: true,
                  })}
                />
              </Stack>
            ))}

            <Button
              variant="outlined"
              style={{ margin: "auto" }}
              startIcon={<Add />}
              onClick={() =>
                productsField.append({
                  name: "",
                  price: 0,
                  qte: 1,
                })
              }
            >
              Ajouter un produit
            </Button>
          </Stack>
        </Stack>
        <Divider />
        <Stack direction={"row"} gap={2} justifyContent={"center"}>
          <Button onClick={back}>Annuler</Button>
          <Button
            variant="contained"
            disabled={!isDirty || !isValid || isPending}
            onClick={onSubmit}
          >
            Sauvegarder
          </Button>
        </Stack>
      </Stack>
    </Block>
  );
}

type InvoiceSaveFormProps = {
  clients: GetClients;
  products: GetProducts;
  paymentsMode: GetPaymentsMode["results"];
  invoice?: GetInvoiceById;
};
