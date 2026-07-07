import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useId } from "react";
import { potsQuery, totalBalanceQuery } from "src/features/pots/queries";
import { addPotFn } from "src/server/functions/pots.fn";
import type { ModalAllocation } from "src/shared/components/allocation-disc";
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

type Pot = {
  id: string;
  name: string;
  percentage: number;
  color: string;
  isDefault: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  existingPots: Pot[];
  initialPct?: number;
};

const NEW_POT_ID = "__new__";

const POT_COLOR_PALETTE = [
  "#4fb8b2",
  "#e87d4f",
  "#7d4fe8",
  "#4f9ee8",
  "#e84f7d",
  "#8be84f",
  "#e8c84f",
];

function pickInitialColor(existingPots: Pot[]): string {
  const used = new Set(existingPots.map((p) => p.color));
  return POT_COLOR_PALETTE.find((c) => !used.has(c)) ?? "#e87d4f";
}

const addPotFormSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required."),
    color: z.string().min(1),
    allocations: z.array(
      z.object({ id: z.string(), name: z.string(), percentage: z.number() }),
    ),
  })
  .refine(
    (data) => data.allocations.reduce((s, a) => s + a.percentage, 0) === 100,
    { message: "Allocations must total 100%", path: ["allocations"] },
  )
  .refine(
    (data) =>
      (data.allocations.find((a) => a.id === NEW_POT_ID)?.percentage ?? 0) >= 1,
    { message: "New pot must have at least 1%", path: ["allocations"] },
  );

function computeInitialAllocations(
  existingPots: Pot[],
  initialPct?: number,
): ModalAllocation[] {
  const general = existingPots.find((p) => p.isDefault);
  const stolen = (() => {
    if (!general) return 0;
    const raw = initialPct ?? Math.floor(general.percentage / 2);
    return Math.max(0, Math.min(raw, general.percentage - 1));
  })();

  return [
    ...existingPots.map((p) => ({
      id: p.id,
      name: p.name,
      percentage: p.isDefault ? p.percentage - stolen : p.percentage,
    })),
    { id: NEW_POT_ID, name: "New Pot", percentage: stolen },
  ];
}

export function AddPotDialog({
  open,
  onClose,
  existingPots,
  initialPct,
}: Props) {
  const formId = useId();
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: addPotFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: potsQuery.queryKey });
      qc.invalidateQueries({ queryKey: totalBalanceQuery.queryKey });
      onClose();
    },
  });

  const f = useAppForm({
    defaultValues: {
      name: "",
      color: pickInitialColor(existingPots),
      allocations: computeInitialAllocations(existingPots, initialPct),
    },
    validators: { onSubmit: addPotFormSchema },
    onSubmit: ({ value }) => {
      const newPot = value.allocations.find((a) => a.id === NEW_POT_ID);
      if (!newPot) throw new Error("Cannot submit with empty new pot");
      const otherPots = value.allocations
        .filter((a) => a.id !== NEW_POT_ID)
        .map((a) => ({ id: a.id, percentage: a.percentage }));
      mutation.mutate({
        data: {
          name: value.name,
          color: value.color,
          percentage: newPot.percentage,
          otherPots,
        },
      });
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset only on open transition
  useEffect(() => {
    if (open) {
      f.reset({
        name: "",
        color: pickInitialColor(existingPots),
        allocations: computeInitialAllocations(existingPots, initialPct),
      });
      mutation.reset();
    }
  }, [open]);

  const colors = [...existingPots.map((p) => p.color)];

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
        <DialogContent className="sm:max-w-xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Pot</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <f.AppField name="name">
              {(field) => (
                <field.InputField label="Name" placeholder="e.g. Vacation" />
              )}
            </f.AppField>

            <f.AppField name="color">
              {(field) => <field.ColorField label="Color" />}
            </f.AppField>

            <f.Subscribe selector={(s) => s.values.color}>
              {(formColor) => (
                <f.AppField name="allocations">
                  {(field) => (
                    <field.AllocationField colors={[...colors, formColor]} />
                  )}
                </f.AppField>
              )}
            </f.Subscribe>

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
                Add Pot
              </f.SubmitButton>
            </f.AppForm>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
