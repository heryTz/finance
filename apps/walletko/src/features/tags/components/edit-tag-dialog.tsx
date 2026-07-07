import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useId } from "react";
import { tagKeys } from "src/features/tags/queries";
import { editTagFn } from "src/server/functions/tags.fn";
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

type Tag = { id: string; name: string };

type Props = {
  open: boolean;
  onClose: () => void;
  tag: Tag;
};

const editTagSchema = z.object({
  name: z.string().trim().min(1, "Tag name is required."),
});

export function EditTagDialog({ open, onClose, tag }: Props) {
  const formId = useId();
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: editTagFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tagKeys.all });
      onClose();
    },
  });

  const f = useAppForm({
    defaultValues: { name: tag.name },
    validators: { onSubmit: editTagSchema },
    onSubmit: ({ value }) => {
      mutation.mutate({ data: { id: tag.id, name: value.name } });
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset only on open transition
  useEffect(() => {
    if (open) {
      f.reset({ name: tag.name });
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
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <f.AppField name="name">
              {(field) => <field.InputField label="Name" />}
            </f.AppField>

            {mutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {mutation.error?.message === "name_conflict"
                    ? "A tag with this name already exists."
                    : "Something went wrong. Please try again."}
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
                Save Changes
              </f.SubmitButton>
            </f.AppForm>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
