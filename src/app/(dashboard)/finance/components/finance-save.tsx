"use client";
import { FinanceType } from "@/entity";
import { useForm } from "react-hook-form";
import { useTags } from "../../tag/tag-query";
import {
  useFinanceById,
  useFinanceSave,
  useFinanceUpdate,
  useFinances,
} from "../finance-query";
import { useEffect } from "react";
import { Modal } from "@/components/modal";
import { Loader } from "@/components/loader";
import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveFinanceInputSchema } from "../finance-dto";
import { SelectField } from "@/components/select-field";
import { InputField } from "@/components/input-field";
import { CalendarField } from "@/components/calendar-field";
import { MultiSelectField } from "@/components/multi-select-field";
import { AutocompleteField } from "@/components/autocomplete-field";
import { zd } from "@/lib/zod";
import { toast } from "sonner";

// TODO: Fix focus for CalendarField, Button
// TODO: Fix error js - press enter on input autocomplete and press arrow down

type FormData = zd.infer<typeof saveFinanceInputSchema>;

export function FinanceSave({
  open,
  onOpenChange,
  idToEdit,
  onFinish,
}: FinanceSaveProps) {
  const tags = useTags();
  const financeItem = useFinanceById(idToEdit);
  const create = useFinanceSave();
  const update = useFinanceUpdate();
  const finances = useFinances({ distinct: "true" });
  const form = useForm<FormData>({
    resolver: zodResolver(saveFinanceInputSchema),
    defaultValues: {
      label: "",
      amount: 0,
      tags: [],
      type: FinanceType.depense,
      createdAt: new Date(),
    },
  });

  useEffect(() => {
    if (financeItem.data?.data) {
      const data = saveFinanceInputSchema.parse({
        ...financeItem.data.data,
        tags: financeItem.data.data.tags.map((el) => el.name),
      });
      form.reset(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [financeItem.data]);

  const onSubmit = form.handleSubmit((data) => {
    if (idToEdit) {
      update.mutate(
        { ...data, id: idToEdit },
        {
          onSuccess: () => {
            toast("Modification effectuée avec succès");
            onOpenChange(false);
            onFinish?.();
          },
        },
      );
    } else {
      create.mutate(data, {
        onSuccess: () => {
          toast("Ajout effectué avec succès");
          onOpenChange(false);
          onFinish?.();
        },
      });
    }
  });

  const onCancel = () => {
    onOpenChange(false);
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
        disabled: create.isLoading || financeItem.isLoading || update.isLoading,
      }}
    >
      {idToEdit && financeItem.isLoading ? (
        <Loader />
      ) : (
        <Form {...form}>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <AutocompleteField
                  label="Libellé"
                  value={field.value}
                  onChange={field.onChange}
                  hideEmptySuggestion
                  options={
                    finances.data?.data.results.map((el) => ({
                      label: el.label,
                      value: el.label,
                    })) ?? []
                  }
                />
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <SelectField
                  value={field.value}
                  onChange={field.onChange}
                  label="Type"
                  options={[
                    { value: FinanceType.revenue, label: "Revenu" },
                    { value: FinanceType.depense, label: "Dépense" },
                  ]}
                />
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <InputField label="Montant" {...field} type="number" />
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <MultiSelectField
                  label="Tags"
                  freeSolo
                  value={field.value}
                  onChange={field.onChange}
                  options={
                    tags.data?.data.results.map((el) => ({
                      label: el.name,
                      value: el.name,
                    })) ?? []
                  }
                />
              )}
            />
            <FormField
              control={form.control}
              name="createdAt"
              render={({ field }) => (
                <CalendarField
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

type FinanceSaveProps = {
  idToEdit?: string;
  onFinish?: () => void;
  open: boolean;
  onOpenChange: (v: boolean) => void;
};
