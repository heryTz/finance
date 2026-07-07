import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useId } from "react";
import { potsQuery } from "src/features/pots/queries";
import { editPotFn } from "src/server/functions/pots.fn";
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
  pot: Pot;
};

const editPotFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  color: z.string().min(1),
});

export function EditPotDialog({ open, onClose, pot }: Props) {
  const formId = useId();
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: editPotFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: potsQuery.queryKey });
      onClose();
    },
  });

  const f = useAppForm({
    defaultValues: { name: pot.name, color: pot.color },
    validators: { onSubmit: editPotFormSchema },
    onSubmit: ({ value }) => {
      mutation.mutate({
        data: { potId: pot.id, name: value.name, color: value.color },
      });
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset only on open transition
  useEffect(() => {
    if (open) {
      f.reset();
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Pot</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <f.AppField name="name">
              {(field) => <field.InputField label="Name" />}
            </f.AppField>

            <f.AppField name="color">
              {(field) => <field.ColorField label="Color" />}
            </f.AppField>
          </div>

          {mutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                Something went wrong. Please try again.
              </AlertDescription>
            </Alert>
          )}

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
                Save Changes
              </f.SubmitButton>
            </f.AppForm>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
