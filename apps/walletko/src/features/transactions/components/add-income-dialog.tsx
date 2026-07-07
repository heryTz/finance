import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useId } from "react";
import { dashboardKeys } from "src/features/dashboard/queries";
import { potsQuery, totalBalanceQuery } from "src/features/pots/queries";
import { tagKeys, tagsQuery } from "src/features/tags/queries";
import { transactionKeys } from "src/features/transactions/queries";
import { receiveIncomeFn } from "src/server/functions/income.fn";
import { useAppForm } from "src/shared/form/form-setup";
import { Alert, AlertDescription } from "src/shared/ui/alert";
import { Button } from "src/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/shared/ui/dialog";
import { z } from "zod";

type AddIncomeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const comboboxOptionSchema = z.object({ value: z.string(), label: z.string() });

const addIncomeSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  amount: z
    .number({ error: "Enter a valid amount." })
    .positive("Amount must be greater than zero."),
  date: z.date(),
  tags: z.array(comboboxOptionSchema),
});

export function AddIncomeDialog({ open, onOpenChange }: AddIncomeDialogProps) {
  const formId = useId();
  const qc = useQueryClient();
  const { data: tagSuggestions = [] } = useQuery(tagsQuery);

  const tagOptions = tagSuggestions.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const mutation = useMutation({
    mutationFn: receiveIncomeFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tagKeys.all });
      qc.invalidateQueries({ queryKey: potsQuery.queryKey });
      qc.invalidateQueries({ queryKey: totalBalanceQuery.queryKey });
      qc.invalidateQueries({ queryKey: dashboardKeys.all });
      qc.invalidateQueries({ queryKey: transactionKeys.all });
      onOpenChange(false);
    },
  });

  const f = useAppForm({
    defaultValues: {
      name: "",
      amount: 0,
      date: new Date(),
      tags: [] as z.infer<typeof comboboxOptionSchema>[],
    },
    validators: { onSubmit: addIncomeSchema },
    onSubmit: ({ value }) =>
      mutation.mutate({
        data: {
          name: value.name,
          amount: value.amount,
          tags: value.tags.map((opt) => {
            const match = tagSuggestions.find((s) => s.id === opt.value);
            return match
              ? { id: match.id, name: match.name }
              : { id: null, name: opt.label };
          }),
          createdAt: value.date,
        },
      }),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: i know what i do
  useEffect(() => {
    if (open) {
      f.reset();
      mutation.reset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          f.handleSubmit();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Income</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <f.AppField name="name">
              {(field) => (
                <field.InputField
                  label="Name"
                  placeholder="e.g. April Salary"
                />
              )}
            </f.AppField>

            <f.AppField name="amount">
              {(field) => <field.AmountField label="Amount" />}
            </f.AppField>

            <f.AppField name="date">
              {(field) => <field.DatePickerField label="Date" />}
            </f.AppField>

            <f.AppField name="tags">
              {(field) => (
                <field.ComboboxField
                  label="Tags"
                  options={tagOptions}
                  placeholder="Add tags…"
                  searchPlaceholder="Search or create tag…"
                  emptyText="No tags found."
                  canCreate
                />
              )}
            </f.AppField>

            {mutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Something went wrong. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />
            <f.AppForm>
              <f.SubmitButton form={formId} isLoading={mutation.isPending}>
                Add Income
              </f.SubmitButton>
            </f.AppForm>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
