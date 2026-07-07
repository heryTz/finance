import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardKeys } from "src/features/dashboard/queries";
import { tagKeys, tagsQuery } from "src/features/tags/queries";
import {
  expenseQuery,
  transactionKeys,
} from "src/features/transactions/queries";
import { updateExpenseFn } from "src/server/functions/expense.fn";
import { useAppForm } from "src/shared/form/form-setup";
import { useFormatCurrency } from "src/shared/hooks/use-format-currency";
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
import { Spinner } from "src/shared/ui/spinner";
import { z } from "zod";

type EditExpenseDialogProps = {
  expenseId: string | null;
  onOpenChange: (open: boolean) => void;
};

const comboboxOptionSchema = z.object({ value: z.string(), label: z.string() });

const editExpenseSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  date: z.date(),
  tags: z.array(comboboxOptionSchema),
});

type ExpenseData = {
  id: string;
  name: string;
  amount: number;
  createdAt: Date | string;
  tags: { id: string; name: string }[];
  allocations: { potId: string; amount: number }[];
};

type EditExpenseFormProps = {
  data: ExpenseData;
  onClose: () => void;
};

function EditExpenseForm({ data, onClose }: EditExpenseFormProps) {
  const qc = useQueryClient();
  const { formatFromCent } = useFormatCurrency();
  const { data: tagSuggestions = [] } = useQuery(tagsQuery);
  const tagOptions = tagSuggestions.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const mutation = useMutation({
    mutationFn: updateExpenseFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tagKeys.all });
      qc.invalidateQueries({ queryKey: transactionKeys.all });
      qc.invalidateQueries({ queryKey: dashboardKeys.all });
      onClose();
    },
  });

  const f = useAppForm({
    defaultValues: {
      name: data.name,
      date: new Date(data.createdAt),
      tags: data.tags.map((t) => ({ value: t.id, label: t.name })),
    },
    validators: { onSubmit: editExpenseSchema },
    onSubmit: ({ value }) =>
      mutation.mutate({
        data: {
          id: data.id,
          name: value.name,
          date: value.date,
          tags: value.tags.map((opt) => {
            const match = tagSuggestions.find((s) => s.id === opt.value);
            return match
              ? { id: match.id, name: match.name }
              : { id: null, name: opt.label };
          }),
        },
      }),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        f.handleSubmit();
      }}
      className="space-y-4"
    >
      <div className="space-y-4 pt-2">
        <p className="text-sm text-muted-foreground">
          Amount:{" "}
          <span className="font-medium text-foreground">
            {formatFromCent(data.amount)}
          </span>
        </p>
        <f.AppField name="name">
          {(field) => (
            <field.InputField
              label="Name"
              placeholder="e.g. Grocery Shopping"
            />
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
          <f.SubmitButton isLoading={mutation.isPending}>
            Save Changes
          </f.SubmitButton>
        </f.AppForm>
      </DialogFooter>
    </form>
  );
}

export function EditExpenseDialog({
  expenseId,
  onOpenChange,
}: EditExpenseDialogProps) {
  const { data, isLoading, isError } = useQuery({
    ...expenseQuery(expenseId ?? ""),
    enabled: expenseId !== null,
  });

  return (
    <Dialog open={expenseId !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner className="size-5 text-primary" />
          </div>
        ) : isError ? (
          <Alert variant="destructive" className="my-4">
            <AlertDescription>
              Failed to load expense. Please try again.
            </AlertDescription>
          </Alert>
        ) : data ? (
          <EditExpenseForm
            key={expenseId ?? "closed"}
            data={data}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
