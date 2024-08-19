"use client";
import { FinanceType } from "@/entity";
import { Autocomplete, MenuItem, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useFinanceSaveStore } from "../finance-store";
import { Controller, useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { useTags } from "../../tag/tag-query";
import {
  useFinanceById,
  useFinanceSave,
  useFinanceUpdate,
  useFinances,
} from "../finance-query";
import { useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { Modal } from "@/components/modal";
import { Loader } from "@/components/loader";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveFinanceInputSchema } from "../finance-dto";

type FormData = {
  label: string;
  type: FinanceType;
  amount: string;
  tags: string[];
  createdAt: Dayjs;
};

export function FinanceSaveModal() {
  const { open, onClose, onFinish, idToEdit } = useFinanceSaveStore();
  const { data: tags, isLoading: tagsLoading } = useTags();
  const { data: financeData, isLoading: financeLoading } =
    useFinanceById(idToEdit);
  const { mutate: create, isLoading: saveLoading } = useFinanceSave();
  const { mutate: update, isLoading: updateLoading } = useFinanceUpdate();
  const { data: existFinance, isLoading: existFinanceLoading } = useFinances({
    distinct: "true",
  });
  const form = useForm<FormData>({
    // resolver: zodResolver(saveFinanceInputSchema),
    defaultValues: {
      label: "",
      amount: "",
      tags: [],
      type: FinanceType.depense,
      createdAt: dayjs(),
    },
  });

  useEffect(() => {
    if (financeData?.data) {
      const data = financeData.data;
      form.reset({
        label: data.label,
        amount: data.amount.toString(),
        createdAt: dayjs(data.createdAt),
        tags: data.tags.map((el) => el.name),
        type: data.type as FinanceType,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [financeData]);

  const onSubmit = form.handleSubmit((data) => {
    const input = {
      ...data,
      amount: +data.amount,
      createdAt: data.createdAt.toISOString(),
    };
    if (idToEdit) {
      update(
        { ...input, id: idToEdit },
        {
          onSuccess: () => {
            enqueueSnackbar("Modification effectué avec succès", {
              variant: "success",
            });
            onFinish();
          },
        },
      );
    } else {
      create(input, {
        onSuccess: () => {
          enqueueSnackbar("Ajout effectué avec succès", { variant: "success" });
          onFinish();
        },
      });
    }
  });

  const onCancel = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onOpenChange={(v) => !v && onCancel()}
      title={idToEdit ? "Modifier une opération" : "Ajouter une opération"}
      description="Ajoutez vos transactions pour garder le contrôle de vos finances."
      cancel={{ onClick: onCancel }}
      submit={{
        onClick: onSubmit,
        disabled: saveLoading || financeLoading || updateLoading,
      }}
    >
      {idToEdit && financeLoading ? (
        <Loader />
      ) : (
        <Form {...form}>
          <div className="grid gap-4">
            <Controller
              control={form.control}
              name="label"
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  freeSolo
                  loading={existFinanceLoading}
                  options={
                    existFinance?.data.results.map((el) => el.label) ?? []
                  }
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField {...params} label="Libellé" />
                  )}
                  value={field.value}
                  onInputChange={(_, value) => {
                    field.onChange(value);
                    const item = existFinance?.data?.results.find(
                      (el) => el.label === value,
                    );
                    if (item) {
                      form.setValue(
                        "tags",
                        item.tags.map((el) => el.name),
                      );
                    }
                  }}
                />
              )}
            />
            <Controller
              control={form.control}
              name="type"
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  select
                  label="Type"
                  value={field.value}
                  onChange={field.onChange}
                >
                  <MenuItem value={FinanceType.revenue}>Revenu</MenuItem>
                  <MenuItem value={FinanceType.depense}>Dépense</MenuItem>
                </TextField>
              )}
            />
            <Controller
              control={form.control}
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
              control={form.control}
              name="tags"
              render={({ field }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  loading={tagsLoading}
                  options={tags?.data.results.map((el) => el.name) ?? []}
                  getOptionLabel={(option) => option}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField {...params} label="Tags" />
                  )}
                  value={field.value}
                  onChange={(_, value) => field.onChange(value)}
                />
              )}
            />
            <Controller
              control={form.control}
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
          </div>
        </Form>
      )}
    </Modal>
  );
}
