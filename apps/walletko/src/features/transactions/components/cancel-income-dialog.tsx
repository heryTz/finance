import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardKeys } from "src/features/dashboard/queries";
import { potKeys } from "src/features/pots/queries";
import {
  incomeCancelPreviewQuery,
  transactionKeys,
} from "src/features/transactions/queries";
import { cancelIncomeFn } from "src/server/functions/income.fn";
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

type PreviewLine = {
  potId: string;
  potName: string;
  amount: number;
  resultingBalance: number | null;
  status: "ok" | "shortfall" | "pot_archived";
  shortfall: number;
};

type CancelIncomeDialogProps = {
  income: { id: string; name: string } | null;
  onOpenChange: (open: boolean) => void;
};

export function CancelIncomeDialog({
  income,
  onOpenChange,
}: CancelIncomeDialogProps) {
  const qc = useQueryClient();
  const { formatFromCent } = useFormatCurrency();

  const {
    data: preview,
    isLoading,
    isError,
  } = useQuery({
    ...incomeCancelPreviewQuery(income?.id ?? ""),
    enabled: income !== null,
  });

  const mutation = useMutation({
    mutationFn: cancelIncomeFn,
    onSuccess: (result) => {
      if (result.blocked) {
        if (income) {
          qc.invalidateQueries({
            queryKey: transactionKeys.incomeCancelPreview(income.id),
          });
        }
        return;
      }
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
  const blocked = previewReady && preview.blocked;
  const raceBlocked = mutation.data?.blocked === true;

  return (
    <Dialog open={income !== null} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel income</DialogTitle>
          <DialogDescription>
            The money this income added will be taken back from each pot.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner className="size-5 text-primary" />
          </div>
        ) : !previewReady ? (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load the cancellation details. Please try again.
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
                  <span>{line.potName}</span>
                  <span className="flex items-center gap-2 shrink-0 tabular-nums">
                    <span className="font-medium text-destructive">
                      −{formatFromCent(line.amount)}
                    </span>
                    {resultText(line, formatFromCent)}
                  </span>
                </li>
              ))}
            </ul>
            {blocked && (
              <Alert variant="destructive">
                <AlertDescription>
                  {blockMessage(preview.lines, formatFromCent)}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {(mutation.isError || raceBlocked) && (
          <Alert variant="destructive">
            <AlertDescription>
              {raceBlocked
                ? "This income can no longer be cancelled — a pot would go negative. Please review and try again."
                : "Something went wrong. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            Keep income
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              income && mutation.mutate({ data: { id: income.id } })
            }
            disabled={
              mutation.isPending || !previewReady || blocked || raceBlocked
            }
          >
            {mutation.isPending ? "Cancelling…" : "Cancel income"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const resultText = (
  line: PreviewLine,
  formatFromCent: (cents: number) => string,
) => {
  if (line.status === "pot_archived") {
    return (
      <span className="text-destructive">pot archived — can’t reclaim ⚠</span>
    );
  }
  const negative = line.status === "shortfall";
  return (
    <span className={negative ? "text-destructive" : "text-muted-foreground"}>
      → {formatFromCent(line.resultingBalance ?? 0)}
      {negative ? " ⚠" : " left"}
    </span>
  );
};

const blockMessage = (
  lines: PreviewLine[],
  formatFromCent: (cents: number) => string,
): string => {
  const bad = lines.filter((l) => l.status !== "ok");
  if (bad.length === 1) {
    const l = bad[0];
    if (l.status === "pot_archived") {
      return `Can't cancel — "${l.potName}" was archived, so its money was moved and can't be reclaimed.`;
    }
    return `Can't cancel — "${l.potName}" would go negative by ${formatFromCent(l.shortfall)}. You've already spent income allocated to it. Free up that pot first.`;
  }
  const list = bad
    .map((l) =>
      l.status === "pot_archived"
        ? `"${l.potName}" (archived)`
        : `"${l.potName}" (${formatFromCent(l.shortfall)})`,
    )
    .join(", ");
  return `Can't cancel — these pots block it: ${list}. Free them up first.`;
};
