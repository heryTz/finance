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
  const tagsFn = useTags();
  const financeFn = useFinanceById(idToEdit);
  const finance = financeFn.data?.data;
  const createFn = useFinanceSave();
  const updateFn = useFinanceUpdate();
  const financesFn = useFinances({ distinct: "true" });
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
    if (finance) {
      const data = saveFinanceInputSchema.parse({
        ...finance,
        tags: finance.tags.map((el) => el.name),
      });
      form.reset(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finance]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (idToEdit) {
        await updateFn.mutateAsync({ ...data, id: idToEdit });
        toast.success("Modification effectuée avec succès");
      } else {
        await createFn.mutateAsync(data);
        toast.success("Ajout effectué avec succès");
      }
      onOpenChange(false);
      onFinish?.();
    } catch (error) {
      toast.error("Une erreur s'est produite");
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
      cancel={{ onClick: onCancel }}
      submit={{
        onClick: onSubmit,
        disabled:
          createFn.isLoading || financeFn.isLoading || updateFn.isLoading,
      }}
    >
      {idToEdit && financeFn.isLoading ? (
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
                    financesFn.data?.data.results.map((el) => ({
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
                    tagsFn.data?.data.results.map((el) => ({
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
