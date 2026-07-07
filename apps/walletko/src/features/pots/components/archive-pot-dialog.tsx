import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useId, useMemo, useState } from "react";
import { potsQuery, totalBalanceQuery } from "src/features/pots/queries";
import { archivePotFn } from "src/server/functions/pots.fn";
import type { ModalAllocation } from "src/shared/components/allocation-disc";
import { useAppForm } from "src/shared/form/form-setup";
import { useFormatCurrency } from "src/shared/hooks/use-format-currency";
import { Alert, AlertDescription } from "src/shared/ui/alert";
import { Button } from "src/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/shared/ui/dialog";
import { Select } from "src/shared/ui/select";
import { z } from "zod";

type Pot = {
  id: string;
  name: string;
  percentage: number;
  balance: number;
  color: string;
  isDefault: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  pot: Pot;
  remainingPots: Pot[];
};

const archivePotFormSchema = z
  .object({
    toPotId: z.string(),
    percentages: z.array(
      z.object({ id: z.string(), name: z.string(), percentage: z.number() }),
    ),
  })
  .refine((d) => d.percentages.reduce((s, p) => s + p.percentage, 0) === 100, {
    message: "Percentages must sum to 100",
    path: ["percentages"],
  });

export function ArchivePotDialog({ open, onClose, pot, remainingPots }: Props) {
  const formId = useId();
  const qc = useQueryClient();
  const { formatFromCent } = useFormatCurrency();

  const needsTransfer = pot.balance > 0;
  const steps = useMemo(
    () =>
      needsTransfer
        ? ["move", "redistribute", "confirm"]
        : ["redistribute", "confirm"],
    [needsTransfer],
  );
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];

  const colors = remainingPots.map((p) => p.color);
  const destinationOptions = remainingPots.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const mutation = useMutation({
    mutationFn: archivePotFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: potsQuery.queryKey });
      qc.invalidateQueries({ queryKey: totalBalanceQuery.queryKey });
      onClose();
    },
  });

  const buildDefaults = () => ({
    toPotId: "",
    percentages: remainingPots.map((p) => ({
      id: p.id,
      name: p.name,
      percentage: p.isDefault ? p.percentage + pot.percentage : p.percentage,
    })) as ModalAllocation[],
  });

  const f = useAppForm({
    defaultValues: buildDefaults(),
    validators: {
      onSubmit: archivePotFormSchema,
      onChange: archivePotFormSchema,
    },
    onSubmit: ({ value }) => {
      mutation.mutate({
        data: {
          potId: pot.id,
          toPotId: needsTransfer ? value.toPotId : undefined,
          remainingPotsPercentages: value.percentages.map((p) => ({
            id: p.id,
            percentage: p.percentage,
          })),
        },
      });
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset only on open transition
  useEffect(() => {
    if (open) {
      f.reset(buildDefaults());
      setStepIndex(0);
      mutation.reset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          f.handleSubmit();
        }}
      >
        <DialogContent className="max-w-lg flex flex-col max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Archive {pot.name}</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Your transaction history will be
              preserved.
            </DialogDescription>
          </DialogHeader>

          <div className="-mx-4 max-h-[70dvh] overflow-y-auto px-4 flex-1 space-y-6">
            {step === "move" && (
              <div className="space-y-3">
                <Alert>
                  <AlertDescription>
                    {pot.name} still holds {formatFromCent(pot.balance)}. Choose
                    where to move it before archiving.
                  </AlertDescription>
                </Alert>
                <f.AppField name="toPotId">
                  {(field) => (
                    <Select
                      value={field.state.value}
                      onChange={field.handleChange}
                      options={[
                        { value: "", label: "Select a pot…" },
                        ...destinationOptions,
                      ]}
                      className="w-full"
                    />
                  )}
                </f.AppField>
              </div>
            )}

            {step === "redistribute" && (
              <div>
                <p className="text-sm font-medium mb-3">
                  Redistribute allocation (%)
                </p>
                <f.AppField name="percentages">
                  {(field) => <field.AllocationField colors={colors} />}
                </f.AppField>
              </div>
            )}

            {step === "confirm" && (
              <p className="text-sm text-muted-foreground">
                Archive {pot.name}? This cannot be undone.
              </p>
            )}

            {mutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Something went wrong. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            {stepIndex > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStepIndex(stepIndex - 1)}
              >
                Back
              </Button>
            ) : (
              <DialogClose
                render={
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                }
              />
            )}

            {step !== "confirm" ? (
              <f.Subscribe selector={(s) => s.values}>
                {(values) => {
                  const canProceed =
                    step === "move"
                      ? values.toPotId !== ""
                      : values.percentages.reduce(
                          (sum, p) => sum + p.percentage,
                          0,
                        ) === 100;
                  return (
                    <Button
                      type="button"
                      disabled={!canProceed}
                      onClick={() => setStepIndex(stepIndex + 1)}
                    >
                      Next
                    </Button>
                  );
                }}
              </f.Subscribe>
            ) : (
              <f.AppForm>
                <f.SubmitButton
                  form={formId}
                  variant="destructive"
                  isLoading={mutation.isPending}
                >
                  Archive Pot
                </f.SubmitButton>
              </f.AppForm>
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
