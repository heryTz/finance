import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardKeys } from "src/features/dashboard/queries";
import { potKeys } from "src/features/pots/queries";
import {
  expenseCancelPreviewQuery,
  transactionKeys,
} from "src/features/transactions/queries";
import { cancelExpenseFn } from "src/server/functions/expense.fn";
import { useFormatCurrency } from "src/shared/hooks/use-format-currency";
import { Alert, AlertDescription } from "src/shared/ui/alert";
import { Button } from "src/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/shared/ui/dialog";
import { Spinner } from "src/shared/ui/spinner";

type CancelExpenseDialogProps = {
  expense: { id: string; name: string } | null;
  onOpenChange: (open: boolean) => void;
};

export function CancelExpenseDialog({
  expense,
  onOpenChange,
}: CancelExpenseDialogProps) {
  const qc = useQueryClient();
  const { formatFromCent } = useFormatCurrency();

  const {
    data: preview,
    isLoading,
    isError,
  } = useQuery({
    ...expenseCancelPreviewQuery(expense?.id ?? ""),
    enabled: expense !== null,
  });

  const mutation = useMutation({
    mutationFn: cancelExpenseFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: transactionKeys.all });
      qc.invalidateQueries({ queryKey: dashboardKeys.all });
      qc.invalidateQueries({ queryKey: potKeys.all });
      onOpenChange(false);
    },
  });

  const handleClose = () => {
    mutation.reset();
    onOpenChange(false);
  };

  const previewReady = !isLoading && !isError && preview != null;

  return (
    <Dialog open={expense !== null} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel expense</DialogTitle>
          <DialogDescription>
            The money this expense took will be returned to each pot.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner className="size-5 text-primary" />
          </div>
        ) : !previewReady ? (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load the refund details. Please try again.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-2">
            <ul className="divide-y rounded-md border">
              {preview.lines.map((line) => (
                <li
                  key={line.potId}
                  className="flex items-center justify-between gap-2 px-3 py-2 text-sm"
                >
                  <span className="flex flex-wrap items-center gap-1.5">
                    {line.potName}
                    {line.redirected && (
                      <span className="text-xs text-muted-foreground">
                        (no longer exists → {preview.defaultPotName})
                      </span>
                    )}
                  </span>
                  <span className="flex shrink-0 items-center gap-2 tabular-nums">
                    <span className="font-medium text-income">
                      +{formatFromCent(line.amount)}
                    </span>
                    {!line.redirected && line.resultingBalance !== null && (
                      <span className="text-muted-foreground">
                        → {formatFromCent(line.resultingBalance)}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            {preview.redirectTotal > 0 && (
              <p className="text-xs text-muted-foreground">
                {formatFromCent(preview.redirectTotal)} from archived pots will
                be returned to {preview.defaultPotName}.
              </p>
            )}
          </div>
        )}

        {mutation.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              Something went wrong. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            Keep expense
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              expense && mutation.mutate({ data: { id: expense.id } })
            }
            disabled={mutation.isPending || !previewReady}
          >
            {mutation.isPending ? "Cancelling…" : "Cancel expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
