import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useId } from "react";
import { dashboardKeys } from "src/features/dashboard/queries";
import { PotPicker } from "src/features/pots/components/pot-picker";
import { potsQuery, totalBalanceQuery } from "src/features/pots/queries";
import { tagKeys, tagsQuery } from "src/features/tags/queries";
import { transactionKeys } from "src/features/transactions/queries";
import type { PotWithBalanceDTO } from "src/server/contracts/pot";
import { payExpenseFn } from "src/server/functions/expense.fn";
import { useAppForm } from "src/shared/form/form-setup";
import { useFormatCurrency } from "src/shared/hooks/use-format-currency";
import { useFormatError } from "src/shared/lib/use-format-error";
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
import { FormField } from "src/shared/ui/form-field";
import { z } from "zod";

type DrawFromEntry = {
  potId: string;
  potName: string;
  balance: number;
  amount: number;
};

type AddExpenseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const comboboxOptionSchema = z.object({ value: z.string(), label: z.string() });

const drawFromEntrySchema = z
  .object({
    potId: z.string(),
    potName: z.string(),
    balance: z.number(),
    amount: z
      .number({ error: "Enter a valid amount." })
      .positive("Amount must be greater than zero."),
  })
  .refine((e) => e.amount <= e.balance / 100, {
    message: "Amount exceeds available balance.",
    path: ["amount"],
  });

const addExpenseSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  date: z.date(),
  tags: z.array(comboboxOptionSchema),
  drawFrom: z.array(drawFromEntrySchema).min(1, "Select at least one pot."),
});

export function AddExpenseDialog({
  open,
  onOpenChange,
}: AddExpenseDialogProps) {
  const formId = useId();
  const qc = useQueryClient();
  const { data: tagSuggestions = [] } = useQuery(tagsQuery);
  const { data: pots = [] } = useQuery(potsQuery);
  const { formatFromCent } = useFormatCurrency();
  const formatError = useFormatError();

  const tagOptions = tagSuggestions.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const mutation = useMutation({
    mutationFn: payExpenseFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: potsQuery.queryKey });
      qc.invalidateQueries({ queryKey: totalBalanceQuery.queryKey });
      qc.invalidateQueries({ queryKey: tagKeys.all });
      qc.invalidateQueries({ queryKey: dashboardKeys.all });
      qc.invalidateQueries({ queryKey: transactionKeys.all });
      onOpenChange(false);
    },
  });

  const f = useAppForm({
    defaultValues: {
      name: "",
      date: new Date(),
      tags: [] as z.infer<typeof comboboxOptionSchema>[],
      drawFrom: [] as DrawFromEntry[],
    },
    validators: { onSubmit: addExpenseSchema },
    onSubmit: ({ value }) =>
      mutation.mutate({
        data: {
          name: value.name,
          tags: value.tags.map((opt) => {
            const match = tagSuggestions.find((s) => s.id === opt.value);
            return match
              ? { id: match.id, name: match.name }
              : { id: null, name: opt.label };
          }),
          drawFrom: value.drawFrom.map((e) => ({
            potId: e.potId,
            amount: e.amount,
          })),
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
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <f.AppField name="name">
              {(field) => (
                <field.InputField label="Name" placeholder="e.g. Groceries" />
              )}
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
            <f.AppField name="drawFrom" mode="array">
              {(drawFromField) => {
                const entries = drawFromField.state.value as DrawFromEntry[];
                const selectedIds = new Set(entries.map((e) => e.potId));
                const availableOptions = (pots as PotWithBalanceDTO[]).filter(
                  (p) => !selectedIds.has(p.id) && p.balance > 0,
                );
                const topLevelError = drawFromField.state.meta.isValid
                  ? undefined
                  : formatError(drawFromField.state.meta.errors);
                const total = entries.reduce((s, e) => s + e.amount, 0);

                return (
                  <FormField label="Draw from" error={topLevelError}>
                    <div className="space-y-2">
                      {entries.map((entry, i) => (
                        <div
                          key={entry.potId}
                          className="flex items-start gap-2"
                        >
                          <div className="flex-1 min-w-0 pt-1">
                            <p className="text-sm font-medium truncate">
                              {entry.potName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFromCent(entry.balance)} available
                            </p>
                          </div>
                          <f.AppField name={`drawFrom[${i}].amount`}>
                            {(amountField) => (
                              <amountField.AmountField label="" />
                            )}
                          </f.AppField>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="mt-0.5"
                            onClick={() => drawFromField.removeValue(i)}
                            aria-label={`Remove ${entry.potName}`}
                          >
                            <X />
                          </Button>
                        </div>
                      ))}

                      <PotPicker
                        options={availableOptions}
                        onSelect={(pot) =>
                          drawFromField.pushValue({
                            potId: pot.id,
                            potName: pot.name,
                            balance: pot.balance,
                            amount: 0,
                          })
                        }
                      />

                      {entries.length > 0 && (
                        <p className="text-sm tabular-nums text-right text-muted-foreground">
                          Total: {formatFromCent(Math.round(total * 100))}
                        </p>
                      )}
                    </div>
                  </FormField>
                );
              }}
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
                Add Expense
              </f.SubmitButton>
            </f.AppForm>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
