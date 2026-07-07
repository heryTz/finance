import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useId } from "react";
import { potsQuery, totalBalanceQuery } from "src/features/pots/queries";
import { editAllocationFn } from "src/server/functions/pots.fn";
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
  allPots: Pot[];
};

const editAllocationFormSchema = z
  .object({
    allocations: z.array(
      z.object({ id: z.string(), name: z.string(), percentage: z.number() }),
    ),
  })
  .refine(
    (data) => data.allocations.reduce((s, a) => s + a.percentage, 0) === 100,
    { message: "Allocations must total 100%", path: ["allocations"] },
  );

export function EditAllocationDialog({ open, onClose, allPots }: Props) {
  const formId = useId();
  const colors = allPots.map((p) => p.color);

  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: editAllocationFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: potsQuery.queryKey });
      qc.invalidateQueries({ queryKey: totalBalanceQuery.queryKey });
      onClose();
    },
  });

  const f = useAppForm({
    defaultValues: {
      allocations: allPots.map((p) => ({
        id: p.id,
        name: p.name,
        percentage: p.percentage,
      })) as ModalAllocation[],
    },
    validators: {
      onSubmit: editAllocationFormSchema,
    },
    onSubmit: ({ value }) => {
      mutation.mutate({
        data: {
          allPots: value.allocations.map((a) => ({
            id: a.id,
            percentage: a.percentage,
          })),
        },
      });
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset only on open transition
  useEffect(() => {
    if (open) {
      f.reset({
        allocations: allPots.map((p) => ({
          id: p.id,
          name: p.name,
          percentage: p.percentage,
        })),
      });
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
        <DialogContent className="sm:max-w-xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Allocation</DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <f.AppField name="allocations">
              {(field) => <field.AllocationField colors={colors} />}
            </f.AppField>

            {mutation.isError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                  Something went wrong. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="mt-4">
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />
            <f.AppForm>
              <f.SubmitButton form={formId} isLoading={mutation.isPending}>
                Save Changes
              </f.SubmitButton>
            </f.AppForm>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
