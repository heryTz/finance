"use client";
import { FinanceType } from "@/entity";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useFinanceSaveStore } from "../finance-store";
import { Controller, useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { useTags } from "../../tag/tag-query";
import { useFinanceSave } from "../finance-query";
import { useEffect } from "react";

type FormData = {
  label: string;
  type: FinanceType;
  amount: string;
  tags: string[];
  createdAt: Dayjs;
};

export function FinanceSaveDialog() {
  const { open, onClose, onFinish, idToEdit } = useFinanceSaveStore();
  const { data: tags, isLoading: tagsLoading } = useTags();
  const { mutate, isLoading: saveLoading } = useFinanceSave();
  const { control, formState, handleSubmit } = useForm<FormData>({
    defaultValues: {
      label: "",
      amount: "",
      tags: [],
      type: FinanceType.depense,
      createdAt: dayjs(),
    },
  });
  const { isValid } = formState;

  useEffect(() => {
    // if (idToEdit)
  }, [idToEdit]);

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        ...data,
        amount: +data.amount,
        createdAt: data.createdAt.toISOString(),
      },
      { onSuccess: () => onFinish() }
    );
  });

  if (!open) return null;

  return (
    <Dialog open={open} keepMounted maxWidth="sm" fullWidth>
      <DialogTitle>Ajout</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Controller
            control={control}
            name="label"
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label="Libellé"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="type"
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                select
                label="Type"
                value={field.value}
                onChange={field.onChange}
              >
                <MenuItem value={FinanceType.revenue}>Revenue</MenuItem>
                <MenuItem value={FinanceType.depense}>Dépense</MenuItem>
              </TextField>
            )}
          />
          <Controller
            control={control}
            name="amount"
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label="Montant"
                type="number"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <Autocomplete
                multiple
                freeSolo
                loading={tagsLoading}
                options={tags?.data.results.map((el) => el.name) ?? []}
                getOptionLabel={(option) => option}
                filterSelectedOptions
                renderInput={(params) => <TextField {...params} label="Tags" />}
                value={field.value}
                onChange={(_, value) => field.onChange(value)}
              />
            )}
          />
          <Controller
            control={control}
            name="createdAt"
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                label="Date de création"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          variant="contained"
          disabled={!isValid || saveLoading}
          onClick={onSubmit}
        >
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  );
}
