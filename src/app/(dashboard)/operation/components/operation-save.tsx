"use client";
import { OperationType } from "@/entity/operation";
import { useForm } from "react-hook-form";
import { useTags } from "../../tag/tag-query";
import { useGetOperationById, useGetOperations } from "../operation-query";
import { useEffect, useTransition } from "react";
import { Modal } from "@/components/modal";
import { Loader } from "@/components/loader";
import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveOperationInputSchema } from "../operation-dto";
import { SelectField } from "@/components/select-field";
import { InputField } from "@/components/input-field";
import { CalendarField } from "@/components/calendar-field";
import { MultiSelectField } from "@/components/multi-select-field";
import { AutocompleteField } from "@/components/autocomplete-field";
import { zd } from "@/lib/zod";
import { toast } from "sonner";
import {
  createOperationAction,
  updateOperationAction,
} from "../operation-action";

// TODO: Fix error js - press enter on input autocomplete and press arrow down

type FormData = zd.infer<typeof saveOperationInputSchema>;

export function OperationSave({
  open,
  onOpenChange,
  idToEdit,
  onFinish,
}: OperationSaveProps) {
  const [isPending, startTransition] = useTransition();
  const tagsFn = useTags();
  const operationFn = useGetOperationById(idToEdit);
  const operation = operationFn.data?.data;
  const operationsFn = useGetOperations({ distinct: "true" });
  const form = useForm<FormData>({
    resolver: zodResolver(saveOperationInputSchema),
    defaultValues: {
      label: "",
      amount: 0,
      tags: [],
      type: OperationType.depense,
      createdAt: new Date(),
    },
  });

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation]);

  const reset = () => {
    if (operation) {
      const data = saveOperationInputSchema.parse({
        ...operation,
        tags: operation.tags.map((el) => el.name),
      });
      form.reset(data);
    } else {
      form.reset();
    }
  };

  const onSubmit = form.handleSubmit((data) =>
    startTransition(async () => {
      try {
        if (idToEdit) {
          await updateOperationAction(idToEdit, data);
          toast.success("Modification effectuée avec succès");
        } else {
          await createOperationAction(data);
          toast.success("Ajout effectué avec succès");
        }
        onOpenChange(false);
        onFinish?.();
        reset();
      } catch (error) {
        toast.error("Une erreur s'est produite");
      }
    }),
  );

  const onCancel = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Modal
      open={open}
      onOpenChange={(v) => !v && onCancel()}
      title={idToEdit ? "Modifier une opération" : "Ajouter une opération"}
      cancel={{ onClick: onCancel }}
      submit={{
        onClick: onSubmit,
        disabled: isPending || operationFn.isLoading,
      }}
    >
      {idToEdit && operationFn.isLoading ? (
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
                  onChange={(value) => {
                    field.onChange(value);
                    const item = operationsFn.data?.results.find(
                      (el) => el.label === value,
                    );
                    if (item) {
                      form.setValue(
                        "tags",
                        item.tags.map((el) => el.name),
                      );
                    }
                  }}
                  options={
                    operationsFn.data?.results.map((el) => ({
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
                    { value: OperationType.revenue, label: "Revenu" },
                    { value: OperationType.depense, label: "Dépense" },
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

type OperationSaveProps = {
  idToEdit?: string;
  onFinish?: () => void;
  open: boolean;
  onOpenChange: (v: boolean) => void;
};
